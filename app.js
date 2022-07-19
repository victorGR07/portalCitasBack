if (!process.env.NODE_ENV || !process.env.PORT) {
  console.error(
    "\n\n--------------------------------------------------------------------------------"
  );
  console.error(
    "--------------------------------------------------------------------------------\n\n"
  );
  console.error(
    "      Enviroment variables are missing                                              "
  );
  console.error(
    "      Press Ctrl+C to quit ...                                                      "
  );
  console.error(
    "\n\n--------------------------------------------------------------------------------"
  );
  console.error(
    "--------------------------------------------------------------------------------\n\n\n"
  );
  throw new Error("Enviroment variables are missing!");
} else {
  require("@babel/register");
  require("./api/_server/_index");
}
