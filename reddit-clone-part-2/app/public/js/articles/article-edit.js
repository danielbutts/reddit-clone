(function() {
  'use strict'

  angular.module('app')
    .component('articleEdit', {
      controller: controller,
      template: `
      <div class="pull-right">
        <p><a class="btn btn-info" <span ng-if="$ctrl.newFormVisible">Cancel</span></a></p>
      </div>

      <div class="row">
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
              <input id="image-url" class="form-control" ng-model="$ctrl.newArticle.url">
            </div><br>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
      `
    })

    controller.$inject = ['$http']
    function controller($http) {
      const vm = this

      vm.$onInit = function () {
        $http.get('/api/posts/').then(function (response) {
          console.log(response);
          vm.articles = response.data
        })
      }
    }


}());
