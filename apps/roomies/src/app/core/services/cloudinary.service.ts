import { Injectable } from '@angular/core';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

declare var cloudinary: any;

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private _uploadResult = new BehaviorSubject(null);
  uploadResult = this._uploadResult
    .asObservable()
    .pipe(filter((res) => res !== null));

  private readonly CLOUDINARY_STYLES = {
    palette: {
      window: '#FFF',
      windowBorder: '#3f51b5',
      tabIcon: '#3f51b5',
      menuIcons: '#3f51b5',
      textDark: '#000000',
      textLight: '#FFFFFF',
      link: '#3f51b5',
      action: '#3f51b5',
      inactiveTabIcon: '#0E2F5A',
      error: '#F44235',
      inProgress: '#3f51b5',
      complete: '#20B832',
      sourceBg: '#E4EBF1',
    },
    fonts: {
      "'Nunito', sans-serif":
        'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap',
    },
  };

  private readonly AVATAR_CLOUDINARY_UPLOAD_CONFIG = {
    cloudName: 'donatos',
    uploadPreset: 'nribccrv',
    sources: [
      'local',
      'url',
      'camera',
      'image_search',
      'facebook',
      'instagram',
    ],
    cropping: true,
    // croppingCoordinatesMode: 'face',
    tags: ['users', 'avatar'],
    styles: this.CLOUDINARY_STYLES,
  };
  widget: any;

  constructor(private cloud: Cloudinary) {}

  openWidget() {
    this.createAvatarWidget();
    this.widget.open();
  }

  getAvatarImg(url: string, transformation = {}): Promise<string> {
    const defaultTransform = {
      width: 40,
      height: 40,
      gravity: 'face',
      radius: 'max',
      crop: 'fill',
      fetchFormat: 'auto',
      type: 'fetch',
      background: '#3f51b5',
      // border: '2px_solid_eaeae9',
    };
    return new Promise((res, rej) => {
      const html = this.cloud
        .imageTag(url, {
          ...defaultTransform,
          ...transformation,
        })
        .toHtml() as string;
      res(html);
    });
  }

  private createAvatarWidget() {
    this.widget = cloudinary.createUploadWidget(
      this.AVATAR_CLOUDINARY_UPLOAD_CONFIG,
      (
        error,
        result: {
          event: string;
          info: { secure_url: string; thumbnail_url: string };
        }
      ) => {
        if (error) {
          console.log(error);
        }
        if (result) {
          this._uploadResult.next(result);
        }
      }
    );
  }
}
