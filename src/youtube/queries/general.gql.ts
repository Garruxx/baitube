export const generalSearchQuery = (query: string) => {
  return `
    {
        general(visitorId:"", query:"${query}"){
            visitorId
            bestMatch{
                title
                id 
                type
                duration
                artists{
                    name
                }
            }
            tracks{
                songs{
                    title
                    id
                    duration
                    artists{
                        name
                    }
                }
                continuation{
                    params
                    query
                }
            }
        }
    }
    `;
};
