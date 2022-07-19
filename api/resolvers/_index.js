import path from "path";
import { fileLoader } from "merge-graphql-schemas";

const resolvers = fileLoader(path.join(__dirname, "./**/*.rsv.*"));

export default resolvers;
