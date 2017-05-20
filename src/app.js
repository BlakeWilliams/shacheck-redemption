import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Drop from './components/drop'
import appStyles from './app-styles'
import buildDmg from './lib/dmg'

class App extends React.Component {
  state = {
    dmg: null,
  }

  onDrop(filePath) {
    buildDmg(filePath).then(dmg => {
      this.setState({ dmg })
    });
  }

  render() {
    const { dmg } = this.state

    return (
      <div style={styles.body}>
        <DragDropContextProvider backend={HTML5Backend}>
          <Drop onDrop={filePath => this.onDrop(filePath)}/>
        </DragDropContextProvider>

        {dmg && <p>{dmg.checksum}</p>}
        {dmg && <p>{dmg.name} - {dmg.version}</p>}
      </div>
    )
  }
}

const styles = {
  body: {
    padding: appStyles.baseSpacing,
  },
  input: {
    fontSize: 16,
    marginTop: appStyles.baseSpacing,
    width: '100%',
  },
}

ReactDOM.render(<App/>, document.getElementById('react-wrapper'))
