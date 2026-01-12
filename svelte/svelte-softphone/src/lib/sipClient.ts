// src/lib/sipClient.ts
import {
    UserAgent,
    Registerer,
    Inviter,
    Invitation,
    SessionState,
  } from "sip.js";
  
  let userAgent: UserAgent;
  let registerer: Registerer;

  const sessionDescriptionHandlerOptions = {
    constraints: {
      audio: true,
      video: false
    },
    peerConnectionConfiguration: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ],
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      iceTransportPolicy: "all"
    }
  };
  
  export function createUserAgent(config: {
    uri: string;
    transportOptions: any;
    authorizationUsername: string;
    authorizationPassword: string;
  }) {
    userAgent = new UserAgent({
      uri: UserAgent.makeURI(config.uri),
      transportOptions: config.transportOptions,
      authorizationUsername: config.authorizationUsername,
      authorizationPassword: config.authorizationPassword,
      sessionDescriptionHandlerFactoryOptions: sessionDescriptionHandlerOptions
    });
  
    registerer = new Registerer(userAgent);
    return { userAgent, registerer };
  }
  
  export function register() {
    return registerer.register();
  }
  
  export function makeCall(targetUri: string) {
    const uri = UserAgent.makeURI(targetUri);
    if (!uri) {
        throw new Error("Failed to create URI from target");
    }

    const inviter = new Inviter(userAgent, uri, {
        sessionDescriptionHandlerOptions,
        sessionDescriptionHandlerModifiers: [],
        earlyMedia: true
    });

    return inviter.invite();
  }
  
  export function onIncomingCall(callback: (session: Invitation) => void) {
    userAgent.delegate = {
      onInvite: (invitation) => {
        invitation.sessionDescriptionHandlerOptions = sessionDescriptionHandlerOptions;
        callback(invitation);
      },
    };
  }
  