export interface BestResult {
	title: string;
	id: string;
	type: string;
	watchId: string;
	duration: string,
	artists: Array<{
		name: string;
	}>;
}
