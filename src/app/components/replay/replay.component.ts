import {Component, HostListener, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {fabric} from "fabric";
import {TagData} from "../../models/tagData.model";
import {MetadataService} from 'src/app/services/metadata.service';
import {Metadata} from "../../models/metadata.model";
import {Team} from "../../models/team.model";
import {ReplayService} from "../../services/replay.service";
import {Constellation} from "../../models/constellationData.model";
import {AnchorsPositions} from "../../models/court/dimensions_court";
import {Court} from "../../models/court/court.model";
import {Point} from "../../models/cartesian/point.model";
import {ChangeContext, LabelType, Options} from "@angular-slider/ngx-slider";

const ws_url = 'ws://localhost:8081/replay';

@Component({
    selector: "app-replay",
    templateUrl: "./replay.component.html",
    styleUrls: ["./replay.component.css"],
})
export class ReplayComponent implements OnInit {

    private mapActiveTags: Map<number, fabric.Group> = new Map();
    private canvas!: fabric.Canvas;
    public canvasWidth: number = 0;
    public canvasHeight: number = 0;
    private courtRealWidth: number = 0;
    private courtRealHeight: number = 0;
    private leftOffCourt: number = 0;
    private topOffCourt: number = 0;
    public playing = false;
    public paused = false;
    public stopped = true;
    public id: string = '';
    public metadata!: Metadata;
    public teams!: Team[];
    private mapColourTags: Map<number, string> = new Map();
    private c!: Constellation;
    private court!: Court;
    public ws!: WebSocket;
    public textColour: string = "#000000";
    public time_in_seconds: number = 0;
    public interval!: number;
    public end_hour: number = 0;
    public end_minute: number = 0;
    public end_second: number = 0;
    public display_second: number = 0;
    public display_minute: number = 0;
    public display_hour: number = 0;
    public optionsSlider!: Options;
    /*firstQuarterDisabled: boolean = false;
    secondQuarterDisabled: boolean = false;
    thirdQuarterDisabled: boolean = false;
    fourthQuarterDisabled: boolean = false;
    fullMatchDisabled: boolean = true;
    private _event: any;*/

    constructor(
        private route: ActivatedRoute, private metadataService: MetadataService, private replayService: ReplayService, private router: Router
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get("id") as string;
        this.metadataService.getMetadataById(this.id).subscribe(
            (response) => {
                this.metadata = response;
                this.teams = this.metadata.teams;
                this.teams.forEach(team => {
                    let players = team.players;
                    let colour = team.colour;
                    players.forEach(player => {
                        this.mapColourTags.set(player.id_tag, colour);
                    });
                });
                //set timer
                if (this.metadata.end_registration_timestamp != undefined) {
                    let initDate = new Date(this.metadata.timestamp);
                    let endDate = new Date(this.metadata.end_registration_timestamp);
                    let diffMs = endDate.getTime() - initDate.getTime();
                    const secs = Math.floor(Math.abs(diffMs) / 1000);
                    const mins = Math.floor(secs / 60);
                    const hours = Math.floor(mins / 60);
                    this.end_hour = hours % 24;
                    this.end_minute = mins % 60;
                    this.end_second = secs % 60;
                    this.optionsSlider = {
                        floor: 0,
                        ceil: secs,
                        showSelectionBar: true,
                        selectionBarGradient: {
                            from: '#52667d',
                            to: '#52667d'
                        },
                        getPointerColor: (): string => {
                            return '#52667d';
                        },
                        translate: (value: number, label:LabelType): string => {
                            switch (label) {
                                case LabelType.Ceil:
                                    return this.timeInSecondsToString(secs);
                                case LabelType.Floor:
                                    return '';
                                default:
                                    return this.timeInSecondsToString(value);
                            }
                        }
                    };
                }
            }
        );
        //generate court and generate heights
        this.canvas = new fabric.Canvas("basketball-court", {
            selection: false,
        });
        this.generateCourt();
        let id = this.id;
        this.ws = new WebSocket(
            `${ws_url}/${id}`,
            "protocolUbies"
        );
    }

    private updateMap(data: string) {
        let parsedData = <TagData[]>JSON.parse(data);
        parsedData.forEach((data) => {
            //TODO IS CORRECT???
            /*let point1 = new Point(data.tag.position);
            let point2= new Point(data.tag.hposition);
            let resultPoint = new Point([(point1.x+point2.x)/2, (point1.y+point2.y)/2]);
            let point = this.court.projectPlayerOnCourt(resultPoint);*/

            let point = this.court.projectPlayerOnCourt(new Point(data.tag.position));
            console.log("x:" + point.x + " y:" + point.y);
            let x = Math.min(Math.max(0, point.x * this.canvasWidth), this.canvasWidth);
            let y = Math.min(
                Math.max(0, Math.abs(point.y * this.canvasHeight)),
                this.canvasHeight
            );
            if (this.mapActiveTags.has(data.tag.id)) {
                this.mapActiveTags.get(data.tag.id)?.set({left: x, top: y});
            } else {
                //set colors
                let circle;
                if (this.mapColourTags.has(data.tag.id)) {
                    let colour = this.mapColourTags.get(data.tag.id)
                    circle = new fabric.Circle({
                        radius: 13,
                        originX: 'center',
                        originY: 'center',
                        fill: colour,
                        opacity: 0.8,
                    });
                    // @ts-ignore
                    if (colour_is_light(colour)) {
                        this.textColour = "#FFFFFF";
                    }
                } else {
                    this.textColour = "#FFFFFF";
                    circle = new fabric.Circle({
                        radius: 13,
                        originX: 'center',
                        originY: 'center',
                        opacity: 0.8,
                    });
                }
                circle.hoverCursor = 'pointer';
                let text = new fabric.Text(String(data.tag.id), {
                    fontSize: 14,
                    originX: 'center',
                    originY: 'center',
                    fill: this.textColour,
                });
                let group = new fabric.Group([circle, text], {
                    left: x,
                    top: y,
                    selectable: false,
                    subTargetCheck: true,
                    hoverCursor: 'pointer',
                });
                group.on('mousedown', () => {
                    //click on tag
                    this.teams.forEach(team => {
                        team.players.forEach(player => {
                            if (player.id_tag == data.tag.id) {
                                player.isSelected = !player.isSelected;
                            } else {
                                player.isSelected = false;
                            }
                        });
                    });
                    console.log('circle:mousedown');
                });
                this.canvas.add(group);
                this.mapActiveTags.set(data.tag.id, group);
            }
        });
        this.canvas.renderAll();
        this.canvas.forEachObject(function (o) {
            o.setCoords()
        });
    }

    playMatch() {
        this.mapActiveTags.forEach(value => this.canvas.remove(value));
        this.mapActiveTags = new Map();
        this.playing = true;
        this.paused = false;
        this.stopped = false;
        this.ws.send("START");
        this.resetTimer();
        this.playTimer();

        this.ws.onmessage = (event) => {
            if (event.data === "END") {
                console.log("end of data");
                this.playing = false;
                this.stopped = true;
                this.paused = false;
            } else {
                this.updateMap(event.data);
            }
        };

        this.ws.onerror = (event) => {
            clearInterval(this.interval);
            this.playing = false;
            this.stopped = true;
            console.log(event);
        };

        this.ws.onclose = (event) => {
            console.log(event);
            console.log("websocket connection closed");
        };
    }

    private generateCourt() {
        this.replayService.getConstellation(this.id).subscribe((response) => {
                this.c = response;
                let points = [];
                points.push(this.c.constellation.A0, this.c.constellation.A1,
                    this.c.constellation.A2, this.c.constellation.A3,
                    this.c.constellation.A4, this.c.constellation.A5,
                    this.c.constellation.A6, this.c.constellation.A7);
                let dimensions = new AnchorsPositions(points);
                this.court = new Court(dimensions);
                let courtWidth: number, courtHeight: number;
                if (window.innerWidth < 1800) {
                    this.canvasWidth = window.innerWidth - 200;
                } else {
                    this.canvasWidth = (window.innerWidth / 100) * 60;
                }
                this.canvasHeight = this.canvasWidth / this.court.ratio;
                // get data from metadata
                if (this.metadata.width_court != null && this.metadata.length_court != null) {
                    this.courtRealWidth = this.metadata.width_court;
                    this.courtRealHeight = this.metadata.length_court;
                } else { //default value if not width/height specified
                    this.courtRealWidth = 2800;
                    this.courtRealHeight = 1500;
                }
                courtWidth = Math.min(this.canvasWidth, (this.canvasWidth * this.courtRealWidth) / this.court.width);
                courtHeight = Math.min(this.canvasHeight, (this.canvasHeight * this.courtRealHeight) / this.court.height);
                this.leftOffCourt = (this.canvasWidth - courtWidth) / 2;
                this.topOffCourt = (this.canvasHeight - courtHeight) / 2;
                console.log("canvas width: " + this.canvasWidth);
                console.log("canvas height: " + this.canvasHeight);
                console.log("real height: " + courtHeight);
                console.log("real width: " + courtWidth);
                console.log("top offset: " + this.topOffCourt);
                console.log("left offset:" + this.leftOffCourt);
                this.canvas.setWidth(this.canvasWidth);
                this.canvas.setHeight(this.canvasHeight);
                this.canvas.clear();
                this.canvas.remove(this.canvas.getActiveObject());
                this.canvas.backgroundColor = "#a95d4d";
                window.fabric.Image.fromURL("../../../assets/images/basketball-court-cutted.png", (img) => {
                    img.set({
                        scaleX: courtWidth / 1500, // width immagine
                        scaleY: courtHeight / 915, // heigth immagine
                        left: this.leftOffCourt,
                        top: this.topOffCourt,
                        selectable: false,
                        evented: false,
                    });
                    this.canvas.add(img);
                });
                this.canvas.renderAll();
                this.canvas.calcOffset();
            },
            (error) => {
                console.log(error);
                return null;
            });
    }

    pauseMatch() {
        this.paused = true;
        this.playing = false;
        this.ws.send("PAUSE");
        clearInterval(this.interval);
    }

    stopMatch() {
        this.playing = false;
        this.stopped = true;
        this.ws.send("STOP");
        this.resetTimer();
    }

    resumeMatch() {
        this.paused = false;
        this.playing = true;
        this.ws.send("RESUME");
        this.playTimer();
    }

    back10() {
        this.ws.send("BACK10");
        this.time_in_seconds = Math.max(0, this.time_in_seconds - 10);
    }

    back30() {
        this.ws.send("BACK30");
        this.time_in_seconds = Math.max(0, this.time_in_seconds - 30);
    }

    forward10() {
        this.ws.send("FORWARD10");
        this.time_in_seconds = this.time_in_seconds + 10;
    }

    forward30() {
        this.ws.send("FORWARD30");
        this.time_in_seconds = this.time_in_seconds + 30;
    }

    closeMatch() {
        this.stopped = true;
        this.playing = false;
        this.paused = false;
        this.ws.send("CLOSE");
        this.ws.close();
    }

    back_to_home() {
        this.stopMatch();
        this.closeMatch();
        this.router.navigateByUrl(`/home`).then();
    }

    playTimer() {
        this.interval = setInterval(() => {
            this.time_in_seconds += 1;
            if (this.display_second == this.end_second && this.display_minute == this.end_minute && this.display_hour == this.end_hour) {
                clearInterval(this.interval);
            }
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.interval);
        this.time_in_seconds = 0;
    }

    timeInSecondsToString(value: number): string {
        this.display_hour = Math.floor(value / (60 * 60));
        let remainder = value - (this.display_hour * 60 * 60);
        this.display_minute = Math.floor(remainder / 60);
        this.display_second = remainder - (this.display_minute * 60);
        let hoursString = this.display_hour.toLocaleString('it-IT', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        let minutesString = this.display_minute.toLocaleString('it-IT', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        let secondsString = this.display_second.toLocaleString('it-IT', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
        return hoursString + ":" + minutesString + ":" + secondsString;
    }

    /*
        showQuarter(quarter: string) {
            switch (quarter) {
                case 'full':
                    this.fullMatchDisabled = true;
                    this.firstQuarterDisabled = false;
                    this.secondQuarterDisabled = false;
                    this.thirdQuarterDisabled = false;
                    this.fourthQuarterDisabled = false;
                    this.ws.send("FULL_MATCH");
                    break;
                case 'first':
                    this.fullMatchDisabled = false;
                    this.firstQuarterDisabled = true;
                    this.secondQuarterDisabled = false;
                    this.thirdQuarterDisabled = false;
                    this.fourthQuarterDisabled = false;
                    this.ws.send("FIRST_QUARTER");
                    break;
                case 'second':
                    this.fullMatchDisabled = false;
                    this.firstQuarterDisabled = false;
                    this.secondQuarterDisabled = true;
                    this.thirdQuarterDisabled = false;
                    this.fourthQuarterDisabled = false;
                    this.ws.send("SECOND_QUARTER");
                    break;
                case 'third':
                    this.fullMatchDisabled = false;
                    this.firstQuarterDisabled = false;
                    this.secondQuarterDisabled = false;
                    this.thirdQuarterDisabled = true;
                    this.fourthQuarterDisabled = false;
                    this.ws.send("THIRD_QUARTER");
                    break;
                case 'fourth':
                    this.fullMatchDisabled = false;
                    this.firstQuarterDisabled = false;
                    this.secondQuarterDisabled = false;
                    this.thirdQuarterDisabled = false;
                    this.fourthQuarterDisabled = true;
                    this.ws.send("FOURTH_QUARTER");
                    break;
            }
        }
    */

    @HostListener('window:resize', ['$event'])
    onResize(event?: any) {
        if (this.playing) {
            this.pauseMatch();
        }
        console.log("HHHHHH" + window.innerHeight);
        console.log("WWWWWW" + window.innerWidth);
        this.generateCourt();
    }

    changeSliderStart() {
        if(this.playing){
            this.paused = true;
            this.playing = false;
            this.ws.send("PAUSE");
            clearInterval(this.interval);
        }
    }

    changeSliderEnd(changeContext: ChangeContext) {
        console.log(changeContext.value);
        let initDate = new Date(this.metadata.timestamp);
        let sliderTime = initDate.getTime() + changeContext.value*1000;
        console.log(sliderTime);
        this.ws.send(sliderTime.toString());
    }
}

function colour_is_light(color: string): boolean {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}