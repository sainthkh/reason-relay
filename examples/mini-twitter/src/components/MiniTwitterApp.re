type state = {
  message: string,
};

type action = Tweet(string);

let component = ReasonReact.reducerComponent("MiniTwitterApp");

let make = (_children) => {
  ...component,
  initialState: () => {
    message: "",
  },

  reducer: (action: action, _state: state) => {
    switch(action) {
    | Tweet(message) => ReasonReact.Update({ message: message })
    }
  },

  render: _self => {
    <div>
      <div>{ ReasonReact.string("Mini Twitter") }</div>
      <div>
        <Editor />
        <div>
          <Message />
        </div>
      </div>
    </div>
  }
}