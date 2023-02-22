# react-native-clipboard-command
类似于淘口令的应用，打开app检测粘贴板内容，但是要求不能更改剪切板的内容，在自己的应用内只能检测一次，再者如果是自己应用内的淘口令，自己不能检测
## Installation

```sh
npm install react-native-clipboard-command
```

## Usage

```js
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
