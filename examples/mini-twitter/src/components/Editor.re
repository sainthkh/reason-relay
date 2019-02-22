type state = {
  message: string,
};

type action = EditText(string);

let component = ReasonReact.reducerComponent("Editor");

let make = (_children) => {
  ...component,
  initialState: () => {
    message: "",
  },

  reducer: (action: action, _state: state) => {
    switch(action) {
    | EditText(message) => ReasonReact.Update({ message: message})
    }
  },

  render: _self => {
    <div>
      <input placeholder="What's happening?" />
    </div>
  }
}