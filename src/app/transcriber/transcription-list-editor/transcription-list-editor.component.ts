import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Annotation } from '../shared/annotation';

@Component({
  selector: 'avl-ngt-transcription-list-editor',
  templateUrl: './transcription-list-editor.component.html',
  styleUrls: ['./transcription-list-editor.component.css'],
})

export class TranscriptionListEditorComponent {
  @Input() annotations: Array<Annotation>;
  @Output() annotationUpdate = new EventEmitter();
  @Output() playerControlEvent = new EventEmitter();

  private _selectedAnnotation: Annotation;
  @Input() private set selectedAnnotation(annotation: Annotation) {
    if (annotation !== this._selectedAnnotation) {
      this.scrollToAnnotation(annotation);
    }
    this._selectedAnnotation = annotation;
  }
  private get selectedAnnotation(): Annotation {
    return this._selectedAnnotation;
  }

  constructor() { }

  public scrollToAnnotation(annotation: Annotation, direct: boolean = false) {
    if (annotation !== null) {
      const elements = document.getElementsByClassName('annotation-forms');

      for (let i = 0; i < elements.length; i++) {
        if (elements[i].id === annotation.id) {
          // Keep one to two elements above where possible, this is less confusing to the user
          if (!direct) {
            if (window.innerHeight > 800) {
              i -= 2;
            } else if (window.innerHeight > 400) {
              i -= 1;
            }

            if (i < 0) {
              i = 0;
            }
          }

          elements[i].scrollIntoView();
          break;
        }
      }
    }
  }

  public getSelectedAnnotation(): Annotation {
    return this.selectedAnnotation;
  }

  public selectAnnotation(selectedAnnotation: Annotation): void {
    if (this.selectedAnnotation !== selectedAnnotation) {
      this.annotationClick(selectedAnnotation);
    }
  }

  public updateAnnotation(ev: any): void {
    if (this.getSelectedAnnotation() !== null) {
      this.annotationUpdate.emit(
        {
          'type': 'edit',
          'annotation': this.getSelectedAnnotation()
        }
      );
    }
  }

  public annotationClick(annotation: Annotation): void {
    if (annotation !== null) {
      this.annotationUpdate.emit(
        {
          'type': 'select',
          'annotation': annotation
        }
      );
    }
  }

  public replayAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        'type': 'replay',
        'annotation': this.getSelectedAnnotation()
      }
    );
  }

  public deleteAnnotationRequest(): void {
    this.playerControlEvent.emit(
      {
        'type': 'delete',
        'annotation': this.getSelectedAnnotation()
      }
    );
  }
}
