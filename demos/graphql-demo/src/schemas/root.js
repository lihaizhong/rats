import { GraphQLObjectType, GraphQLSchema, GraphQLList } from "graphql";
import { GraphQLNav } from "./nav";
import DB from "../models/default";

// 定义根 根里面定义调用对应导航 Schema 类型的方法
const Root = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    navList: {
      type: GraphQLList(GraphQLNav),
      async resolve() {
        const navList = await DB.find("nav", {});

        console.log("navList", navList);
        return navList;
      },
    },
  },
});

//挂载根
export default new GraphQLSchema({
  query: Root,
});
