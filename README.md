A React component for GraphQL syntax highlighting.

Example usage:
```import { GraphQLCodeBlock } from 'react-graphql-syntax-highlighter';```

```
<GraphqlCodeBlock
  className="GraphQLCodeBlock"
  queryBody="query getData($eventId: Int!) {event(id: $eventId) {name,... eventFields ... on Event{attendees(first: 5)}}}"
/>
```

The components only takes two props: `className` and `queryBody`, `queryBody` being a graphql query string (unformatted ok). If you add the class `GraphqlCodeBlock`, you will get some default css. Else, you can write your own css for highlighting certain syntax.
