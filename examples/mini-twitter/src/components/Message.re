let component = ReasonReact.statelessComponent("Message")

let make = (
  _children
) => {
  ...component,

  render: _self => {
    <div>
      { ReasonReact.string("Tweet") }
    </div>
  }
}
