import React from 'react'
import ReactDOM from 'react-dom'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import crypto from 'crypto'
import fs from 'fs'

import Drop from './components/drop'
import appStyles from './app-styles'

class App extends React.Component {
  state = {
    filePath: null,
    checksum: '',
  }

  onDrop(filePath) {
    const hash = crypto.createHash('sha256')
    hash.setEncoding('hex')

    fs.readFile(filePath, (err, data) => {
      const checksum = crypto.createHash('sha256').update(data, 'utf8').digest('hex')
      this.setState({ filePath, checksum })
    })
  }

  render() {
    const { checksum } = this.state

    return (
      <div style={styles.body}>
        <DragDropContextProvider backend={HTML5Backend}>
          <Drop onDrop={filePath => this.onDrop(filePath)}/>
        </DragDropContextProvider>

        {this.state.checksum && <p>{this.state.checksum}</p>}
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
