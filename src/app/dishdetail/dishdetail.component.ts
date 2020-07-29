import { Component, OnInit, Input, ViewChild, Inject} from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { switchMap } from "rxjs/Operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Comment } from "../shared/comment";


@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: String[];
  prev: String;
  next: String;

  @ViewChild('fform') commentFormDirective;
  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    'author': '',
    'comment': ''
  };

  ValidationMessages = {
    'author': {
      'required': 'Author name is required',
      'minlength': 'Author name should be mininum 2 characters'
    },
    'comment': {
      'required': 'Comment is required'
    }
  };

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL
  ) {
    this.createCommentForm();
  };

  ngOnInit() {
    this.createCommentForm();
    this.dishService.getDishIds().subscribe( dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap( (parmas: Params) => this.dishService.getDish(parmas['id'])))
    .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id)});
  }

  goBack(): void {
    this.location.back();
  }

  onValueChanged(data?: any){
    if(!this.commentForm){return;}
    const form = this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.ValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createCommentForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: [5, [Validators.required]],
      comment: ['', [Validators.required]]
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  submitComment(){    
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });

    this.commentFormDirective.resetForm();
  }

  get author() {
    return this.commentForm.get('author').value;
  }
  
  get rating(){
    return this.commentForm.get('rating').value;
  }

  get message(){
    return this.commentForm.get('comment').value;
  }

}
