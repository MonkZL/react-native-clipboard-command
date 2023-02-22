import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { setCommand, useCommand } from 'react-native-clipboard-command';

export default function App() {
  const [commandStr, setCommandStr] = React.useState('');

  useCommand(
    (command) => {
      alert('复制过来的指令是: ' + command);
    },
    (reason) => {
      alert(reason);
    }
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={'请输入口令'}
        value={commandStr}
        onChangeText={setCommandStr}
        style={{
          width: '50%',
          height: 50,
          borderWidth: 1,
          paddingHorizontal: 10,
        }}
      />
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          setCommand(commandStr);
          alert('设置成功');
        }}
      >
        <Text>设置口令</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
