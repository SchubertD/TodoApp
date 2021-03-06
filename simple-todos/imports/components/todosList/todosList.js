import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../api/tasks.js';
import template from './todosList.html';

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('tasks');
        this.hideCompleted = false
        this.helpers({
            tasks() {
                const selector = {};

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }
                // Show newest tasks at the top
                return Tasks.find(selector, { sort: { createdAt: -1 } });
            },

            incompleteCount() {
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }).count();
            },
            currentUser() {
                return Meteor.user();
            }

        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        // Tasks.insert({
        //     text: newTask,
        //     createdAt: new Date,
        //     owner: Meteor.userId(),
        //     username: Meteor.user().username
        // });

        Meteor.call('tasks.insert', newTask);

        // Clear form
        this.newTask = '';
    }

    setChecked(task) {
        // Set the checked property to the opposite of its current value
        // Tasks.update(task._id, {
        //     $set: {
        //         checked: !task.checked
        //     },
        // });

        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }

    removeTask(task) {
        //Tasks.remove(task._id);
        Meteor.call('tasks.remove', task._id);
    }

    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }

}

export default angular.module('todosList', [
    angularMeteor
])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: TodosListCtrl
    });