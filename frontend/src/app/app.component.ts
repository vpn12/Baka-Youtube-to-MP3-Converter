// ng build --prod --aot=false

import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    response = 'Ready for conversion, senpai!';
    mp3Data;

    baseUrl = '';

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.doPopup(true);
        this.response = "Converting your video... baka!";
        this.http.post(this.baseUrl + '/convert/' + match, null).subscribe(data => {
            if (data['failed']) {

                this.doPopup();
                this.response = 'Failed to convert your video! Baka!';
            }
            else {
                this.mp3Data = data;
                this.doPopup(true);
                this.response = this.mp3Data.videoTitle + ' has been converted into an .mp3, baka! Downloading right now...';
                this.download(this.mp3Data.file);
            }
        },
            err => {
                this.doPopup();
                this.response = "Something bad happened! Couldn't convert this video!";
            });
    }

    download(fileName: string) {
        this.http.get(this.baseUrl + '/download/' + fileName.split("videos/")[1], {responseType: 'blob'}).subscribe(data => {
            let blob = new Blob([data], {type: 'audio/mpeg'});
            FileSaver.saveAs(blob, this.mp3Data.videoTitle + '.mp3');

            this.doPopup();
            this.response = "Done! Ready for another, baka!"
        },
            err => {
                this.doPopup();
                this.response = "Couldn't download your video! Baka!";
            });
    }

    doPopup(loading?: boolean) {
        let popup = document.getElementById('message');
        popup.style.visibility = 'visible';

        let load = document.getElementById('loading');
        load.style.visibility = 'hidden';

        if (loading) {
            load.style.visibility = 'visible';
        }
    }

    constructor(private http: HttpClient) {}

    ngOnInit() {
        if (!environment.production) {
            this.baseUrl = 'http://localhost:3000';
        }
    }
}
