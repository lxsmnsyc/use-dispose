import ObjectTracker from './object-tracker';

const { log } = console;

export default class DisposableObject {
  public id: number;

  private disposeLogic: () => void;

  private objectTracker: ObjectTracker<DisposableObject>;

  constructor(
    tracker: ObjectTracker<DisposableObject>,
    container: HTMLElement,
    title: string,
  ) {
    this.objectTracker = tracker;
    this.objectTracker.objects.push(this);
    this.objectTracker.size += 1;

    this.id = tracker.size;

    const callback = () => {
      log(title, this.id);
    };

    container.addEventListener('mouseover', callback, false);
    this.disposeLogic = () => {
      container.removeEventListener('mouseover', callback, false);
    };
  }

  dispose(): void {
    this.objectTracker.objects = this.objectTracker.objects.filter(
      (value) => value !== this,
    );
    this.disposeLogic();
  }
}
