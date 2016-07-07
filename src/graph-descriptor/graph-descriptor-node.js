'use strict';

const React = require('react');
const style = require('./style');

const identity = x => x;
const defaultSteps = [];

module.exports = class GraphDescriptorNode extends React.Component {

  constructor(props) {
    super(props);
    const isCollapsed = !this.props.expanded;
    this.state = { isCollapsed };
  }

  leafNodeClick() {
    const path = this.props.path;
    const fn = this.props.onLeafNodeClick;
    if (fn) {
      fn(path);
    }
  }

  toggleCollapse(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const isCollapsed = !this.state.isCollapsed;
    this.setState({ isCollapsed });
  }

  render() {

    const path = this.props.path;
    const steps = this.props.steps || defaultSteps;
    const node = this.props.node;
    const name = node.name;
    const children = node.children;
    const hasChildren = children && children.length > 0;
    const isLeaf = node.isLeaf;
    const isWildcard = node.isWildcard;
    const descriptors = [];
    const isCollapsed = this.state.isCollapsed;

    if (isWildcard) {
      let wildcardDesc;
      if (node.wildcard === 'keys') {
        wildcardDesc = 'any value';
      } else if (node.wildcard === 'integers') {
        wildcardDesc = 'integers';
      } else if (node.wildcard === 'ranges') {
        wildcardDesc = 'ranges of integers';
      }
      descriptors.push({
        name: 'matches',
        value: wildcardDesc
      });
    }

    if (isLeaf) {
      descriptors.push({
        name: 'type',
        value: node.returns || 'unspecified'
      });
      let ops = [
        node.isReadable && 'readable',
        node.isWritable && 'writable',
        node.isCallable && 'callable'
      ]
      .filter(identity)
      .join(', ');
      if (ops === 'readable') {
        ops = 'readonly';
      } else if (ops === 'readable, writable') {
        ops = 'read/write';
      }
      descriptors.push({
        name: 'access',
        value: ops
      });
    }

    const isLeafClickable = !!this.props.onLeafNodeClick && isLeaf;
    const isBranchClickable = !isLeaf;
    const nodeStyle = {
      color: isLeaf ? style.color.leaf : 'inherit',
    };
    const lineStyle = {
      cursor: isLeafClickable || isBranchClickable ? 'pointer' : 'default',
    };
    const lineClick = isLeafClickable
      ? this.leafNodeClick.bind(this)
      : this.toggleCollapse.bind(this);

    return <li className={isLeaf ? 'is-leaf' : 'is-branch'}>
      <span className="node-line" style={lineStyle} onClick={lineClick}>
        <span className="tree-stuff" style={{whiteSpace:'pre',fontFamily:'"courier new",monospace'}}>
          {steps.map((step, idx) => {
            // "steps" is an array of booleans representing the path to here
            // from root. "true" means the node in that position was last among
            // its siblings. This enables drawing the "tree stuff".
            const isAdjacent = idx === steps.length - 1;
            if (isAdjacent) { return !step ? '\u251C\u2500' : '\u2514\u2500'; }
            else { return !step ? '\u2502\u00A0' : '\u00A0\u00A0'; }
          }).join('')}
        </span>
        <strong className={isLeaf ? 'leaf-color' : undefined} style={nodeStyle}>
          {name}
        </strong>
        {(isWildcard || isLeaf) &&
          <span className="node-info"> ({ descriptors.map(d => `${d.name}: ${d.value}`).join(', ')})</span>
        }
      </span>
      {hasChildren && !isCollapsed &&
        <ul style={{margin:0,padding:0,listStyle:'none'}}>
          {children.map((subchild, idx) => {
            const isLast = idx === children.length - 1;
            const substeps = steps.slice();
            substeps.push(isLast);
            return <GraphDescriptorNode
              key={subchild.name}
              node={subchild}
              steps={substeps}
              path={path.concat(subchild)}
              onLeafNodeClick={this.props.onLeafNodeClick}
              expanded={this.props.expanded}
            />;
          })}
        </ul>
      }
    </li>;
  }
};
