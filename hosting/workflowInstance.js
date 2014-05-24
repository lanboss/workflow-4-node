var Workflow = require("../activities/workflow");
var ActivityExecutionEngine = require("../activities/activityExecutionEngine");
var BeginMethod = require("../activities/beginMethod");
var EndMethod = require("../activities/endMethod");
var ex = require("../activities/activityExceptions");
var hex = require("./hostingExceptions");
var enums = require("../common/enums");
var specStrings = require("../common/specStrings");

function WorkflowInstance(host)
{
    this._host = host;
    this.id = null;
    this._engine = null;
    this._myTrackers = [];
}

WorkflowInstance.prototype.create = function (workflowName, methodName, args)
{
    var self = this;
    
    if (!(workflow instanceof Workflow)) throw new TypeError("Workflow argument expected.");
    self._engine = new ActivityExecutionEngine(workflow);
    self._copyParsFromHost();

    var createMethodReached = false;
    var instanceIdPath = null;
    var createMethodFound = function(mn, ip)
    {
        if (mn == methodName)
        {
            createMethodReached = true;
            if (ip) instanceIdPath = ip;
        }
    }

    self._addCreateHelperTracker(createMethodFound);

    return self._engine.invoke(true).then(
        function ()
        {
            // Completed:
            throw hex.WorkflowException("Workflow has been completed without reaching an instance creator BeginMethod activity.");
        },
        function (e)
        {
            if (e instanceof ex.Idle)
            {
                if (createMethodReached)
                {
                    self._removeMyTrackers();

                    var createEndMethodReached = false;
                    var createEndMethodFound = function(mn, ip)
                    {
                        if (mn == methodName)
                        {
                            createEndMethodReached = true;
                            if (ip) instanceIdPath = ip;
                        }
                    }

                    self._addCreateHelperTracker(createMethodFound);

                    return self._engine.resumeBookmark(specStrings.hosting.createBeginMethodBMName(methodName), enums.ActivityStates.complete, args).then(
                        function()
                        {
                            if (createEndMethodReached)
                            {
                                if (instanceIdPath)
                                {
                                    self.id = new InstanceIdParser(instanceIdPath).parse(args);
                                }
                                else
                                {
                                    throw new hex.WorkflowException("BeginMethod or EndMethod of method name '" + methodName + "' doesn't specify an instanceIdPath property value.");
                                }
                            }
                            else
                            {
                                throw hex.WorkflowException("Workflow has been completed or gone to idle without reaching an EndMethod activity of method name '" + methodName + "'.");
                            }
                        });
                }
                else
                {
                    throw hex.WorkflowException("Workflow has gone to idle without reaching an instance creator BeginMethod activity of method name '" + methodName + "'.");
                }
            }
            else
            {
                // Failed:
                throw e;
            }
        }).finally(function()
        {
            self._removeMyTrackers();
        });
}

WorkflowInstance.prototype._copyParsFromHost = function()
{
    var self = this;
    self._engine.commandTimeout = self._host.commandTimeout;
    self._host._trackers.forEach(function(t)
    {
        self._engine.addTracker(t);
    });
}

WorkflowInstance.prototype._addCreateHelperTracker = function(callback)
{
    var self = this;
    var tracker = {
        activityStateFilter: function(activity, reason, result)
        {
            return activity instanceof BeginMethod &&
                activity.canCreateInstance &&
                _(activity.methodName).isString() &&
                (!activity.instanceIdPath || _(activity.instanceIdPath).isString()) &&
                reason == enums.ActivityStates.idle;
        },
        activityStateChanged: function(activitt, reason, result)
        {
            var methodName = activity.methodName.trim();
            var instanceIdPath = activity.instanceIdPath ? activity.instanceIdPath.trim() : null;
            callback(methodName, instanceIdPath);
        }
    };
    self._engine.addTracker(tracker);
    self._myTrackers.push(tracker);
}

WorkflowInstance.prototype._addCreateEndHelperTracker = function(callback)
{
    var self = this;
    var tracker = {
        activityStateFilter: function(activity, reason, result)
        {
            return activity instanceof EndMethod &&
                _(activity.methodName).isString() &&
                (!activity.instanceIdPath || _(activity.instanceIdPath).isString()) &&
                reason == enums.ActivityStates.complete;
        },
        activityStateChanged: function(activitt, reason, result)
        {
            var methodName = activity.methodName.trim();
            var instanceIdPath = activity.instanceIdPath ? activity.instanceIdPath.trim() : null;
            callback(methodName, instanceIdPath);
        }
    };
    self._engine.addTracker(tracker);
    self._myTrackers.push(tracker);
}

WorkflowInstance.prototype._removeMyTrackers = function()
{
    var self = this;
    self._myTrackers.forEach(function(t)
    {
        self._engine.removeTracker(t);
    });
    self._myTrackers.length = 0;
}

module.exports = WorkflowInstance;
