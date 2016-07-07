'use strict';

const React = require('react');
const GraphDescriptorNode = require('./graph-descriptor-node');
const style = require('./style');

const noChildren = [];

module.exports = class GraphDescriptor extends React.Component {

  render() {

    const descriptor = this.props.descriptor;
    const children = descriptor ? descriptor.children : noChildren;

    return <div className="graph-descriptor" style={{whiteSpace:'nowrap'}}>
      <h2>JSON Graph Documentation</h2>
      <p>
        Note: Leaf nodes are shown as <strong className="leaf-color" style={{color:style.color.leaf}}>this</strong>.
        Nodes preceded by a <strong>:colon</strong> are wildcards that match multiple values.
      </p>
      <ul style={{listStyle:'none',margin:0,padding:0}}>
        {children.map((child, idx) =>
          <GraphDescriptorNode
            key={child.name}
            node={child}
            steps={[idx === children.length - 1]}
            path={[child]}
            onLeafNodeClick={this.props.onLeafNodeClick}
            expanded={this.props.expanded}
          />
        )}
      </ul>
    </div>;
  }
};
