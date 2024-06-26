import type { Location, Params, useMatches } from "@remix-run/react";
import type { RouterState } from "@remix-run/router";

export type HandleConventionArguments<Data = unknown> = {
	id: string;
	data: Data;
	params: Params;
	matches: ReturnType<typeof useMatches>;
	location: Location;
	parentsData: RouterState["loaderData"];
};
