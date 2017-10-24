# Image Search Abstraction Layer


User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

User Story: I can get a list of the most recently submitted search strings.

## Examples


Search for cats:  
`host/search/cats`

Search for cats, skip first 10:  
`host/search/cats?offset=10`

View recent searches:  
`host/recent`
