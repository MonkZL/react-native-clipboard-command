import React from 'react';
import {
  AppState,
  AppStateStatus,
  NativeModules,
  Platform,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-clipboard-command' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ClipboardCommand = NativeModules.ClipboardCommand
  ? NativeModules.ClipboardCommand
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function setCommand(command: string) {
  return ClipboardCommand.setCommand(command);
}

export function getCommand(): Promise<string> {
  return ClipboardCommand.getCommand().then((command: string) => {
    // 重写粘贴板数据打上标记 避免再次读取
    // 可以理解为该命令被标记为已读了 下次不会再次返回
    setCommand(command);
    return command;
  });
}

export function useCommand(
  success: (command: string) => void,
  fail?: (reason: string) => void
) {
  useAppState((appState) => {
    if (appState === 'active') {
      getCommand()
        .then(success)
        .catch((reason) => {
          fail && fail(reason);
        });
    }
  });
}

//传入一个监听函数，appState变化的时候执行
export function useAppState(listener: (appState: AppStateStatus) => void) {
  const [appState, setAppState] = React.useState(AppState.currentState);
  React.useEffect(() => {
    const currentAppState = AppState.currentState;
    if (currentAppState !== appState) {
      setAppState(currentAppState);
      listener(currentAppState);
    }
    const appStateSubscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState !== appState) {
          setAppState(nextAppState);
          listener(nextAppState);
        }
      }
    );
    return () => {
      appStateSubscription.remove();
    };
  }, [listener, appState]);
}
