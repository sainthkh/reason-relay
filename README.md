# reason-relay

This project has been abandoned. If you're finding ReasonML GraphQL client, I recommend [bs-apollo-client](https://github.com/sainthkh/bs-apollo-client) or [reason-apollo](https://github.com/apollographql/reason-apollo). 

## Why did you give up?

When I first started this project, I practiced my GraphQL and ReasonML skills by cloning [Apollo GraphQL's example project](https://github.com/apollographql/fullstack-tutorial) and `reason-apollo`. 

After writing a few lines of code, I realized that the code was too verbose.

```reason
switch(response.hasMore) {
| false => { ReasonReact.string("") }
| true =>
  <button 
    className="btn"
    onClick={_ => {
      open Js;
      open Js.Dict;

      let variables = Dict.empty();
      variables->set("cursor", response.cursor->Json.string)
      
      fetchMore(
        ~variables=variables->Json.object_,
        ~updateQuery=(prev, next) => {
          switch(next->ReasonApolloQuery.fetchMoreResultGet) {
          | None => prev
          | Some(next) => {
            open Jsonx;
            
            let result = obj(next);
            let prev = obj(prev)->emptyIfNone("launches");
            let launches = result->emptyIfNone("launches");
            launches->set("launches", 
              concat(
                prev->defaultIfNone("launches", Json.array([||])), 
                launches->defaultIfNone("launches", Json.array([||]))
              )
            )
            
            result->set("launches", launches->Json.object_);
            result->Json.object_;
          };
          }
        },
        ()
      )
      |> ignore
    }}
    >
    { ReasonReact.string("Load More") }
  </button>
}
```

Equivalent code in JavaScript:

```js
{data.launches &&
  data.launches.hasMore && (
    <Button
      onClick={() =>
        fetchMore({
          variables: {
            after: data.launches.cursor,
          },
          updateQuery: (prev, { fetchMoreResult, ...rest }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...fetchMoreResult,
              launches: {
                ...fetchMoreResult.launches,
                launches: [
                  ...prev.launches.launches,
                  ...fetchMoreResult.launches.launches,
                ],
              },
            };
          },
        })
      }
    >
      Load More
    </Button>
  )
}
```

It happened mostly because the original Apollo Client is designed for loosely-typed JavaScript, not strictly-typed ReasonML. And ReasonML doesn't have an elegant way to handle JSON objects. 

And when it comes to client side state management, the verboseness becomes unmanagable. (1 or 2 lines in JavaScript becomes a full module in ReasonML. That made me think that's too much.)

This unpleasant development experience made me find alternatives. 

## react relay and compiler.

When I first tried `react-relay`, I felt it could solve the underlying problems that `reason-apollo` had. Especially, I loved it because `mutation` isn't a component but a function. (As you well know, Reason React handles side effects in `reducer` function. So, in ReasonML, it is really unreasonable way to handle mutations as render props.)

And it creates types with compilers. So, I thought I could generate ReasonML types with it. 

But there was no ReasonML version for Relay. So, I decided. Let's go make one. 

And as it's my own library, I'll do whatever I want with. 

## relay connection spec. 

I went on and on for almost 3 weeks. But I met a big roadblock: [Relay connection spec](https://facebook.github.io/relay/graphql/connections.htm) and [GraphQL Server Specification](https://facebook.github.io/relay/docs/en/graphql-server-specification.html).

They answered my curiosity about [severely-verbose todomvc schema](https://github.com/relayjs/relay-examples/blob/master/todo/data/schema.graphql) in [official relay example](https://github.com/relayjs/relay-examples).

To use `relay` and list of items, we need to follow that spec no matter what or create our own implementation for pagination without edges.

That's too much. 

## So, I'm going back to Apollo.

After writing a few lines of code, it made think that it's not a dream to make a better ReasonML Apollo Client. 

That's why I'm dropping this project and moving to Apollo again.