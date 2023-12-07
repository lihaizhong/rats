import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } from "graphql";

// 定义导航 Schema 类型
export const GraphQLNav = new GraphQLObjectType({
  name: "nav",
  fields: {
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    sort: {
      type: GraphQLInt,
    },
    status: {
      type: GraphQLInt,
    },
    add_time: {
      type: GraphQLString,
    },
  },
});
