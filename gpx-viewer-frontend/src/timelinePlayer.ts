export class TimelinePlayer {
  #start_point: number;
  #end_point: number;
  #play_speed: number = 100;

  #keypoint_realtime = 0;
  #keypoint_timeline = 0;

  #isPlaying = false;

  constructor({
    start_point,
    end_point,
    play_speed,
  }: {
    start_point: number;
    end_point: number;
    play_speed: number;
  }) {
    this.#play_speed = play_speed;
    this.#start_point = start_point;
    this.#end_point = end_point;

    this.#keypoint_timeline = start_point;
    this.#keypoint_realtime = Date.now();
  }
  togglePlay() {
    if (this.#isPlaying) {
      this.stopPlay();
    } else {
      this.startPlay();
    }
  }
  startPlay() {
    if (this.#isPlaying) return;
    if (this.#end_point - this.#start_point <= 0) return;

    if (this.#keypoint_timeline === this.#end_point) {
      this.#keypoint_timeline = this.#start_point;
    }

    this.#isPlaying = true;
    this.#keypoint_realtime = Date.now();
  }
  stopPlay() {
    if (!this.#isPlaying) return;
    this.#keypoint_timeline = this.getCurrentTs();
    this.#isPlaying = false;
  }

  getCurrentTs() {
    if (!this.#isPlaying) return this.#keypoint_timeline;

    const tmp_val =
      this.#keypoint_timeline +
      (Date.now() - this.#keypoint_realtime) * this.#play_speed;
    if (tmp_val > this.#end_point) {
      //stop play
      this.#keypoint_timeline = this.#end_point;
      this.#isPlaying = false;
      return this.#end_point;
    }
    return tmp_val;
  }
  setCurrentTs(val: number) {
    this.#keypoint_timeline = val;
    this.#keypoint_realtime = Date.now();
  }
  get playSpeed() {
    return this.#play_speed;
  }
  set playSpeed(val: number) {
    this.#play_speed = val;
    this.#keypoint_realtime = Date.now();
    this.#keypoint_timeline = this.getCurrentTs();
  }
  get isPlaying() {
    return this.#isPlaying;
  }

  jumpToPoint(val: number) {
    const ratio = Math.min(Math.max(val, 0), 1);
    const jumpTS =
      this.#start_point + (this.#end_point - this.#start_point) * ratio;
    this.#keypoint_timeline = jumpTS;
    this.#keypoint_realtime = Date.now();
  }

  jumpFromCurrentPoint(ratio: number) {
    const jumpDuration = (this.#end_point - this.#start_point) * ratio;
    let jumpTS = this.getCurrentTs() + jumpDuration;
    jumpTS = Math.min(Math.max(jumpTS, this.#start_point), this.#end_point);
    this.#keypoint_timeline = jumpTS;
    this.#keypoint_realtime = Date.now();
  }
}
