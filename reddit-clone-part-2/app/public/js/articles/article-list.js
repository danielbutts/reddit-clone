(function() {
  'use strict'

  controller.$inject = ['$http']
  function controller($http) {
    const vm = this

    vm.$onInit = function () {
      $http.get('/api/posts').then(function (response) {
        console.log(response)
        vm.articles = response.data
        vm.newFormVisible = false

      })
    }

    vm.toggleNewPostForm = function() {
      delete vm.newArticle
      vm.newFormVisible = !vm.newFormVisible
    }

    vm.toggleCommentForm = function(articleId) {

      vm.articles.forEach((article) => {
        if (article.id === articleId) {
          article.newCommentVisible = !vm.newCommentVisible
        }
      })
    }

    vm.createArticle = function() {
      vm.newFormVisible = false;
      vm.newArticle.score = 0;
      vm.newArticle.comments = [];
      vm.newArticle.date = new Date();
      console.log(vm.newArticle);
      $http.post('/api/posts', vm.newArticle).then(function (response) {
        vm.createdArticle = response.data
        vm.newFormVisible = false
      })

      vm.articles.push(vm.newArticle);
      delete vm.newArticle
    }

    vm.upVote = function(id) {
      vm.articles.forEach((article) => {
        if (article.id === id) {
          $http.post(`/api/posts/${id}/votes`).then(function (response) {
          })
          article.vote_count ++
        }
      })
    }

    vm.downVote = function(id) {
      vm.articles.forEach((article) => {
        if (article.id === id && article.vote_count > 0) {
          $http.delete(`/api/posts/${id}/votes`).then(function (response) {
          })
          article.vote_count --
        }
      })
    }

    vm.addComment = function(id) {
      vm.articles.forEach((article) => {
        if (article.id === id) {
          if (article.comments === undefined) {
            article.comments = []
          }
          let newComment = { post_id: id, content: vm.newComment.content  }

          $http.post(`/api/posts/${id}/comments`, newComment).then(function (response) {
            console.log(response.data);
            delete vm.newComment
            article.comments.push(response.data);
          })
          article.newCommentVisible = false

        }
      })
    }
  }

  angular.module('app')
    .component('articleList', {
      controller: controller,
      template: `
      <div class="pull-right">
        <p><a class="btn btn-info" ng-click="$ctrl.toggleNewPostForm()"><span ng-if="!$ctrl.newFormVisible">New Post</span><span ng-if="$ctrl.newFormVisible">Cancel</span></a></p>
      </div>

      <ul class="nav nav-pills">
        <li role="presentation" class="active">
          <input type="search" class="form-control input-sm search-form" placeholder="Filter" ng-model="$ctrl.filter">
        </li>
        <div class="form-inline">
          <label for="sort">&nbsp;Sort by&nbsp;</label>
          <select class="form-control" ng-model="$ctrl.sort">
            <option value="-score" selected="true">Most Popular</option>
            <option value="-date">Most Recent</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </ul>

      <div class="row" ng-if="$ctrl.newFormVisible">
        <div class="col-md-8">

          <form ng-submit="$ctrl.createArticle()">
            <div>
              <label for="title">Title</label>
              <input id="title" class="form-control" ng-model="$ctrl.newArticle.title">
            </div>
            <div>
              <label for="body">Body</label>
              <textarea id="body" class="form-control" ng-model="$ctrl.newArticle.body"></textarea>
            </div>
            <div>
              <label for="author">Author</label>
              <input id="author" class="form-control" ng-model="$ctrl.newArticle.author">
            </div>
            <div>
              <label for="image-url">Image URL</label>
              <input id="image-url" class="form-control" ng-model="$ctrl.newArticle.image_url">
            </div><br>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">
                Create Post
              </button>
            </div>
          </form>

        </div>
      </div>

      <div class="row">
        <div class="col-xs-12">
          <ng-pluralize count="$ctrl.articles.length"
            when="{'0': 'No Articles:',
              'one': '1 Article:',
              'other': '{} Articles:'}">
          </ng-pluralize>
          <div ng-repeat="article in $ctrl.articles | filter:{title: $ctrl.filter} | orderBy:$ctrl.sort">
            <div class="well">
              <div class="media-left">
                <img class="media-object" ng-src="{{article.image_url}}">
              </div>
              <div class="media-body">
                <h4 class="media-heading">
                  {{article.title}}
                  |
                  <a ng-click="$ctrl.upVote(article.id)"><i class="glyphicon glyphicon-arrow-up"></i></a>
                  <a ng-click="$ctrl.downVote(article.id)"><i class="glyphicon glyphicon-arrow-down"></i></a>
                  {{article.vote_count}}
                </h4>
                <div class="text-right">
                <span>Message age: {{article.created_at}} </span>
                </div>
                <div class="text-right">
                  {{article.author}}
                </div>
                <p>
                  {{article.body}}
                </p>
                <ng-pluralize count="article.comments.length"
                  when="{'0': 'No Comments:',
                    'one': '1 Comment:',
                    'other': '{} Comments:'}">
                </ng-pluralize> | <a ng-click="$ctrl.toggleCommentForm(article.id)"><i class="glyphicon glyphicon-comment"></i></a>
                <div ng-repeat="comment in article.comments">
                  <div>
                    {{ comment.created_at | date:'MM-dd-yyyy @ h:mm a' }} - {{comment.content}}
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-offset-1" ng-if="article.newCommentVisible">
                    <hr>
                    Add a Comment:
                    <form class="form-inline" ng-submit="$ctrl.addComment(article.id)">
                      <div class="form-group">
                        <input class="form-control" ng-model="$ctrl.newComment.content">
                      </div>
                      <div class="form-group">
                        <input type="submit" class="btn btn-primary">
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    })

}());
