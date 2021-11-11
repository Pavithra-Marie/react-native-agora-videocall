import React, {Component} from 'react'
import {Platform, ScrollView, Text, TouchableOpacity, View, PermissionsAndroid} from 'react-native'
// Import the RtcEngine class and view rendering components into your project.
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// Import the UI styles.
import styles from './components/Style'

const requestCameraAndAudioPermission = async () =>{
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ])
        if (
            granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
            && granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log('You can use the cameras & mic')
        } else {
            console.log('Permission denied')
        }
    } catch (err) {
        console.warn(err)
    }
}

// Define a Props interface.
interface Props {
}

// Define a State interface.
interface State {
    appId: string,
    channelName: string,
    token: string,
    joinSucceed: boolean,
    openMicrophone: boolean,
    enableSpeakerphone: boolean,
    peerIds: number[],
}

// Create an App component, which extends the properties of the Pros and State interfaces.
export default class App extends Component<Props, State> {
    _engine?: RtcEngine
    // Add a constructor，and initialize this.state. You need:
    // Replace yourAppId with the App ID of your Agora project.
    // Replace yourChannel with the channel name that you want to join.
    // Replace yourToken with the token that you generated using the App ID and channel name above.
    constructor(props: Props | Readonly<Props>) {
        super(props)
        this.state = {
            appId: '88de4357809a4b8698d461cb2e4387ed',
            channelName: 'test',
            token: '00688de4357809a4b8698d461cb2e4387edIACRXZo3soGj/9qEJvTRQcpIqM42GHXIw2yZsQiMFGz+0Ax+f9gAAAAAEACkCrtypu6NYQEAAQCl7o1h',
            joinSucceed: false,
            openMicrophone: true,
            enableSpeakerphone: true,
            peerIds: [],
        }
        if (Platform.OS === 'android') {
            requestCameraAndAudioPermission().then(() => {
                console.log('requested!')
            })
        }
    }
   // Mount the App component into the DOM.
componentDidMount() {
    this.init()
}
componentWillUnmount(){
    this.init()
}
// Pass in your App ID through this.state, create and initialize an RtcEngine object.
init = async () => {
    const {appId} = this.state
    this._engine = await RtcEngine.create(appId)
    // Enable the video module.
    await this._engine.enableVideo()
     // Enable the audio module.
     await this._engine.enableAudio()


    // Listen for the UserJoined callback.
    // This callback occurs when the remote user successfully joins the channel.
    this._engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed)
        const {peerIds} = this.state
        if (peerIds.indexOf(uid) === -1) {
            this.setState({
                peerIds: [...peerIds, uid]
            })
        }
    })

    // Listen for the UserOffline callback.
    // This callback occurs when the remote user leaves the channel or drops offline.
    this._engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason)
        const {peerIds} = this.state
        this.setState({
            // Remove peer ID from state array
            peerIds: peerIds.filter(id => id !== uid)
        })
    })

    // Listen for the JoinChannelSuccess callback.
    // This callback occurs when the local user successfully joins the channel.
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed)
        this.setState({
            joinSucceed: true
        })
    })
}
_joinChannel = async () => {
    await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0)
}
// Turn the microphone on or off.
_switchMicrophone = () => {
    const { openMicrophone } = this.state
    this._engine?.enableLocalAudio(!openMicrophone).then(() => {
        this.setState({ openMicrophone: !openMicrophone })
      }).catch((err) => {
        console.warn('enableLocalAudio', err)
      })
  }

// Switch the audio playback device.
_switchSpeakerphone = () => {
    const { enableSpeakerphone } = this.state
    this._engine?.setEnableSpeakerphone(!enableSpeakerphone).then(() => {
        this.setState({ enableSpeakerphone: !enableSpeakerphone })
      }).catch((err) => {
        console.warn('setEnableSpeakerphone', err)
      })
  }
// Pass in your token and channel name through this.state.token and this.state.channelName.
// Set the ID of the local user, which is an integer and should be unique. If you set uid as 0, 
// the SDK assigns a user ID for the local user and returns it in the JoinChannelSuccess callback.
startCall = async () => {
    await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0)
}
render() {
    const {
        joinSucceed,
        openMicrophone,
        enableSpeakerphone,
      } = this.state;
    return (
        <View style={styles.max}>
            <View style={styles.max}>
                <View style={styles.buttonHolder}>
                    {joinSucceed ? 
                   
                   [ <TouchableOpacity
                        onPress={this._switchMicrophone}
                        style={styles.button}>
                          {openMicrophone ?  <Icon 
                                name="microphone" 
                               color='#0000ff'
                                style={styles.buttonText}
                                size={25}
                                /> : 
                                <Icon 
                                name="microphone-off" 
                               color='grey'
                                style={styles.buttonText}
                                size={25}
                                />
                         }  
                        {/* <Text style={styles.buttonText}> End Call </Text> */}
                    </TouchableOpacity>,
                    <TouchableOpacity
                    onPress={this._switchSpeakerphone}
                    style={styles.button}>
                      {enableSpeakerphone ?  <Icon 
                            name="volume-high" 
                           color='green'
                            // style={styles.buttonText}
                            size={25}
                            /> : 
                            <Icon 
                            name="volume-off" 
                           color='grey'
                            style={styles.buttonText}
                            size={25}
                            />
                     }  
                    {/* <Text style={styles.buttonText}> End Call </Text> */}
                </TouchableOpacity>,
                 <TouchableOpacity
                 onPress={this.endCall}
                 style={styles.button}>
                      <Icon 
                         name="phone-hangup" 
                        color='#ff0000'
                         style={styles.buttonText}
                         size={25}
                         />
                 {/* <Text style={styles.buttonText}> End Call </Text> */}
             </TouchableOpacity> ]
                :
                     <TouchableOpacity
                     onPress={this.startCall}
                     style={styles.buttonCall}>
                          <Icon 
                             name="phone" 
                             color='#00D100'
                             style={styles.buttonCallText}
                             size={25}
                             />
                     <Text style={styles.buttonCallText}> Start Call </Text>
                 </TouchableOpacity>
                 }
                    
                   

                </View>
                {this._renderVideos()}
            </View>
        </View>
    )
}
// Set the rendering mode of the video view as Hidden, 
// which uniformly scales the video until it fills the visible boundaries.
_renderVideos = () => {
    const {joinSucceed} = this.state
    return joinSucceed ? (
        <View style={styles.fullView}>
            <RtcLocalView.SurfaceView
                style={styles.max}
                channelId={this.state.channelName}
                renderMode={VideoRenderMode.Hidden}/>
            {this._renderRemoteVideos()}
        </View>
    ) : null
}
// Set the rendering mode of the video view as Hidden, 
// which uniformly scales the video until it fills the visible boundaries.
_renderRemoteVideos = () => {
    const {peerIds} = this.state
    return (
        <ScrollView
            style={styles.remoteContainer}
            contentContainerStyle={{paddingHorizontal: 2.5}}
            horizontal={true}>
            {peerIds.map((value, index, array) => {
                return (
                    <RtcRemoteView.SurfaceView
                        style={styles.remote}
                        uid={value}
                        channelId={this.state.channelName}
                        renderMode={VideoRenderMode.Hidden}
                        zOrderMediaOverlay={true}/>
                )
            })}
        </ScrollView>
    )
}
endCall = async () => {
    await this._engine?.leaveChannel()
    this.setState({peerIds: [], joinSucceed: false})
}
}