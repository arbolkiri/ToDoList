;
(function(exports) {
    "use strict";

    Backbone.TodoRouter = Backbone.Router.extend({

        initialize: function() {
            console.log("initialized");
            this.collection = new Backbone.TodoActualList();
            this.view1 = new Backbone.TodoView({//list
                collection: this.collection
            });
            this.view2 = new Backbone.TodoViewDetail({});//details
            Backbone.history.start();
        },
        routes: {
            "*default": "home",
            "details/:item": "showDetail"
        },
        home: function() {
            this.view1.render();
            // this.view2.render(); //Temporary: we'll move the detail view later
        },
        showDetail: function(item) {
            // this.view2.render();
            console.log(item);
        }
    })

    Backbone.TodoModel = Backbone.Model.extend
    ({
        defaults: {
            "checked": "false",
            "title": "No title given.",
            "done": "false"

        },
        validate: function(data) {
            // debugger;
            var x = data.title.length > 0;

            // debugger;
            if (!x) {
                return "Title Required.";
            }
        }
    })

    Backbone.TodoActualList = Backbone.Collection.extend({
        model: Backbone.TodoModel
    })

    Backbone.TodoView = Backbone.TemplateView.extend({
        el: ".container1",
        view: "todoList",
        events: {
            "submit .addItemForm": "addItem",
            "click .data": "showDetail",
            "click .destroy": "deleteItem"
        },

        addItem: function(event) {
            event.preventDefault();
            var x = {
                title: this.el.querySelector("input[name = 'John']").value
            }
            this.collection.add(x, {
                validate: true
            });
            console.log("Yay!");
            // debugger;
        },
        getModelAssociatedWithEvent: function(event){
            var el = event.target,
            li= $(el).closest('li').get(0),
            cid = li.getAttribute('cid'),
            m = this.collection.get(cid);

            return m;
        },
        deleteItem: function(event){
            event.preventDefault();
            this.collection.remove(this.collection.at(0));
            console.log("Por Fin");
        },
        showDetail: function(event){
            event.preventDefault();
            // find model
            var li = event.target.parentElement;//because the cid is on the parentelement, the list item (li from toDoList.html)..event.target is the span in todoList.html
            var cid = li.getAttribute('cid');//from var li on line 75
            var model = this.collection.get(cid);//cid is line 76
            Backbone.trigger("newModelForDetailView", model);//the model is line 77
        }
    })

    Backbone.TodoViewDetail = Backbone.TemplateView.extend({
        el: ".container2",
        view: "todoDetails",
        initialize: function(options) {//we have to create our own inintialize b/c TemplateView.extend has own initialize function
            this.options = options;
            this.listenTo(Backbone, "newModelForDetailView", this.setModel)//listening to line 78
            this.model && this.model.on("change", this.render.bind(this));//

            this.collection && this.collection.on("add reset remove", this.render.bind(this));
        },
        setModel: function(model){
            if(this.model === model){//model is NOT line 77
                this.model = null;
                this.el.innerHTML = "";
            } else {
                this.model = model;
                this.render();
            }
        }
    })

})(typeof module === "object" ? module.exports : window)
