// 播放状态
export var PlayState;
(function (PlayState) {
    PlayState[PlayState["ERROR"] = -1] = "ERROR";
    PlayState[PlayState["UNINIT"] = 0] = "UNINIT";
    PlayState[PlayState["READY"] = 1] = "READY";
    PlayState[PlayState["LOADING"] = 2] = "LOADING";
    PlayState[PlayState["PLAYING"] = 3] = "PLAYING";
    PlayState[PlayState["PAUSED"] = 4] = "PAUSED";
    PlayState[PlayState["ENDED"] = 5] = "ENDED";
})(PlayState || (PlayState = {}));
