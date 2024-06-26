import { IEvents } from './Events';

export class Model<T> {
	protected data: Partial<T>;
	protected events: IEvents;

	constructor(data: Partial<T>, events: IEvents) {
		this.data = data;
		this.events = events;
	}

	// Уведомление об изменении модели
	emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload ?? {});
	}
}
