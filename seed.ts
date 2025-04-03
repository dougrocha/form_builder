import * as schema from "./src/server/db/schema";
import { reset, seed } from "drizzle-seed";
import { db } from "~/server/db";

async function main() {
  await reset(db, schema);

  await seed(db, schema).refine((funcs) => ({
    form: {
      columns: {
        title: funcs.loremIpsum(),
        description: funcs.loremIpsum({
          sentencesCount: 3,
        }),
      },
    },
    formField: {
      columns: {
        label: funcs.loremIpsum(),
        required: funcs.boolean(),
        placeholder: funcs.loremIpsum(),
      },
    },
    formFieldOption: {
      columns: {
        value: funcs.loremIpsum(),
        label: funcs.loremIpsum(),
        position: funcs.int({
          minValue: 1,
          maxValue: 10,
          isUnique: true,
        }),
      },
    },
  }));
}

main();
