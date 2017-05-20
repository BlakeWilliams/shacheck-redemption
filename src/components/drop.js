import React from 'react'
import { NativeTypes } from 'react-dnd-html5-backend'
import { DropTarget } from 'react-dnd'

import appStyles from '../app-styles'

const fileTarget = {
  drop(props, monitor) {
    const { path } = monitor.getItem().files[0]
    props.onDrop(path)
  }
}

class Drop extends React.Component {
  constructor(props) {
    super(props)
    this.state = { dragging: false }
  }

  render() {
    const { connectDropTarget, isOver, canDrop } = this.props

    return connectDropTarget(
      <div
        style={styles.dropContainer}
        onDrop={this.onDrop}
      >
        <i style={styles.files} className="fa fa-files-o"></i>
        <p style={styles.description}>drag and drop your .dmg file here</p>
      </div>
    )
  }
}

const styles = {
  dropContainer: {
    borderRadius: 3,
    border: '4px dashed #ddd',
    padding: appStyles.baseSpacing,
    textAlign: 'center',
  },
  files: {
    color: '#ddd',
    fontSize: 48,
  },
  description: {
    color: '#555',
    fontSize: 16,
    fontFamily: appStyles.fontFamily,
    marginBottom: 0,
  },
}

export default DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  monitor,
}))(Drop)
