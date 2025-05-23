import { useCallback, useEffect, useRef } from "react";
import type { SubmitFunction, SubmitOptions } from "react-router";
import { useSubmit } from "react-router";

type SubmitTarget = Parameters<SubmitFunction>["0"];

/**
 * @deprecated Debounce at the route level instead of the component level.
 * @see https://sergiodxa.com/tutorials/debounce-loaders-and-actions-in-react-router
 */
export function useDebounceSubmit() {
	let timeoutRef = useRef<Timer | undefined>(null);

	useEffect(() => {
		// no initialize step required since timeoutRef defaults undefined
		let timeout = timeoutRef.current;
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, []);

	// Clone the original submit to avoid a recursive loop
	const originalSubmit = useSubmit();

	const submit = useCallback(
		(
			/**
			 * Specifies the `<form>` to be submitted to the server, a specific
			 * `<button>` or `<input type="submit">` to use to submit the form, or some
			 * arbitrary data to submit.
			 *
			 * Note: When using a `<button>` its `name` and `value` will also be
			 * included in the form data that is submitted.
			 */
			target: SubmitTarget,
			/**
			 * Options that override the `<form>`'s own attributes. Required when
			 * submitting arbitrary data without a backing `<form>`. Additionally, you
			 * can specify a `debounceTimeout` to delay the submission of the data.
			 */
			options?: SubmitOptions & {
				/** Submissions within this timeout will be canceled */
				debounceTimeout?: number;
			},
		) => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (!options?.debounceTimeout || options.debounceTimeout <= 0) {
				return originalSubmit(target, options);
			}

			return new Promise<void>((resolve) => {
				timeoutRef.current = setTimeout(() => {
					resolve(originalSubmit(target, options));
				}, options.debounceTimeout);
			});
		},
		[originalSubmit],
	);

	return submit;
}
