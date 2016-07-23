/// <reference path="jquery-1.5-vsdoc.js" />
/// <reference path="corejsmvc.js" />
;
var members = {
    redirect: function (url, isCodedRedirect) {
        if (isCodedRedirect) {
            if ($.trim(url).length > 0 && url != null && typeof (url) != undefined) {
                window.location = url;
            }
        } else {

            // if they checked a box and clicked edit
            var editButtonClicked = false;
            var $editButton = $("#membership-button-edit");
            if ($editButton.length > 0) {
                if ($editButton.gcop().hasClass("selected")) {
                    editButtonClicked = true;
                }
            }

            var $checkedDataElement = $($("#page .search-results .zugo-item .item-selection-column input:checked").parent().parent());
            var drill = url;

            var payload = {};
            payload.ActionType = "DrillDown";
            payload.searchVirtualFilePath = SEARCHES["systemcpfsearchmemberssearch"].searchVirtualFilePath;
            //payload.containerName = "Core";
            //payload.searchName = "Members";
            //payload.searchType = "Search";
            //payload.definitionName = null;
            payload.data = $checkedDataElement.gcop().getAttribute("data-row");

            // if there is a preview, then show it. If not, just drill.
            $checkedDataElement.gcop().addClass("selected");

            // redirect to drill down url if container or search builder definition is not set. 
            // Nb: this indicates that we are not in the compose search screen so tracks are not required.
            SEARCHES["systemcpfsearchmemberssearch"].getNavigationTrack(drill, payload);
        }
    }
};

members.list = {
    load: function () {
        // disable ribbon buttons that cannot be used.
        members.list.enableRibbonButtons({ selectedRows: [] });

        $("#back-button").on("click", function () {
            members.redirect(APPLICATIONPATH + "core", true);
            return false;
        });

        $("#results-container").on("selected", ".search-results", function (event, eventArgs) {
            members.list.enableRibbonButtons(eventArgs);
        });

        $("#membership-button-edit").on("click", function () {
            if (!$(this).hasClass("disabled")) {
                corejs.spin();
                var url = $(".search-results .results-container .item-selection-column input[type=checkbox]:checked").parents(".zugo-item:first").attr("drillDownUrl");
                members.redirect(url);
            }
            return false;
        });

        $("#membership-button-delete").on("click", function () {
            if (!$(this).hasClass("disabled")) {
                if (members.list.getCheckedItemsCount() > 0) {
                    ConfirmationBox.Show($("#delete-membership-confirmation"), members.list.deleteUser);
                }
                else {
                    corejs.alert("RESOURCE{{members.js}:{SelectRowToDelete}:{Please select a row to delete a user.}}", "i");
                }
            }
            return false;
        });

        $("#membership-button-disable").on("click", function () {
            if (!$(this).hasClass("disabled")) {
                if (members.list.getCheckedItemsCount() > 0) {
                    ConfirmationBox.Show($("#disable-membership-confirmation"), members.list.disableUser);
                }
                else {
                    corejs.alert("RESOURCE{{members.js}:{SelectRowToDelete}:{Please select a row to disable a user.}}", "i");
                }
            }
            return false;
        });

        $("#membership-button-enable").on("click", function () {
            if (!$(this).hasClass("disabled")) {
                if (members.list.getCheckedItemsCount() > 0) {
                    ConfirmationBox.Show($("#enable-membership-confirmation"), members.list.enableUser);
                }
                else {
                    corejs.alert("RESOURCE{{members.js}:{SelectRowToDelete}:{Please select a row to enable a user.}}", "i");
                }
            }
            return false;
        });
    },

    enableRibbonButtons: function (eventArgs) {
        var selected = eventArgs.selectedRows.length;
        if (selected === 1) {
            $("#membership-button-delete").removeClass("disabled");
            $("#membership-button-edit").removeClass("disabled");
            $("#membership-button-disable").removeClass("disabled");
            $("#membership-button-enable").removeClass("disabled");
        }
        else if (selected > 1) {
            $("#membership-button-delete").removeClass("disabled");
            $("#membership-button-edit").addClass("disabled");
            $("#membership-button-disable").removeClass("disabled");
            $("#membership-button-enable").removeClass("disabled");
        } else {
            $("#membership-button-edit").addClass("disabled");
            $("#membership-button-delete").addClass("disabled");
            $("#membership-button-disable").addClass("disabled");
            $("#membership-button-enable").addClass("disabled");
        }
        corejs.toolbar.initialiseDropDowns();
    },

    getCheckedItemsCount: function () {
        return $(".search-results .results-container .item-selection-column input[type=checkbox]:checked").length;
    },

    deleteUser: function () {
        var success = function () {
            //   corejs.alert("RESOURCE{{members.js}:{UserDeleted}:{User deleted successfully.}}", "s");
            //   members.redirect(APPLICATIONPATH + "membership");
        };

        var fail = function (data, textStatus, jqXHR) {

            //var msg = "RESOURCE{{members.js}:{FailedToDeleteUser}:{Failed to delete {0}.}}";
            //corejs.alert(msg.replace("{0}", textStatus), "e");
            if (data["unhandled"]) {
                corejs.alert("RESOURCE{{members.js}:{FailedToDeleteUser}:{Failed to delete the user.}}", "e");
            }
        }
        var memberIds = members.list.getMemberIds();
        var memberUserNames = members.list.getMemberUserNames();
        // get the checked items and send them to the server.
        corejs.ajax({ url: APPLICATIONPATH + "membership/remove", success: success, errorCallback: fail, data: { "memberIds": memberIds, "memberUserNames": memberUserNames } });
    },

    disableUser: function () {
        var success = function () { };
        var fail = function (data, textStatus, jqXHR) {

            if (data["unhandled"]) {
                corejs.alert("RESOURCE{{members.js}:{FailedToDisableUser}:{Failed to disable the user.}}", "e");
            }
        };

        var memberIds = members.list.getMemberIds();
        var memberUserNames = members.list.getMemberUserNames();
        // get the checked items and send them to the server.
        corejs.ajax({ url: APPLICATIONPATH + "membership/disable", success: success, errorCallback: fail, data: { "memberIds": memberIds, "memberUserNames": memberUserNames } });
    },

    enableUser: function () {
        var success = function () { };
        var fail = function (data, textStatus, jqXHR) {

            if (data["unhandled"]) {
                corejs.alert("RESOURCE{{members.js}:{FailedToEnableUser}:{Failed to enable the user.}}", "e");
            }
        };

        var memberIds = members.list.getMemberIds();
        var memberUserNames = members.list.getMemberUserNames();
        // get the checked items and send them to the server.
        corejs.ajax({ url: APPLICATIONPATH + "membership/enable", success: success, errorCallback: fail, data: { "memberIds": memberIds, "memberUserNames": memberUserNames } });
    },

    getMemberIds: function () {
        var groupIds = [];
        var checkedItemCount = members.list.getCheckedItemsCount();
        for (i = 0; i < checkedItemCount; i++) {
            var jsonString = $(".search-results .results-container .item-selection-column input[type=checkbox]:checked:eq(" + i + ")").parents(".zugo-item:first").attr("data-row");
            var selectedItem = JSON.parse(jsonString);
            for (j = 0; j < selectedItem.length; j++) {
                if (selectedItem[j]["name"] == "UserID") {
                    groupIds.push(selectedItem[j]["value"]);
                    break;
                }
            }
        }

        return groupIds.join(",");
    },
    getMemberUserNames: function () {
        var groupIds = [];
        var checkedItemCount = members.list.getCheckedItemsCount();
        for (i = 0; i < checkedItemCount; i++) {
            var jsonString = $(".search-results .results-container .item-selection-column input[type=checkbox]:checked:eq(" + i + ")").parents(".zugo-item:first").attr("data-row");
            var selectedItem = JSON.parse(jsonString);
            for (j = 0; j < selectedItem.length; j++) {
                if (selectedItem[j]["name"] == "UserName") {
                    groupIds.push(selectedItem[j]["value"]);
                    break;
                }
            }
        }

        return groupIds.join(",");
    }
};

members.edit = {
    load: function () {

        $("#back-button").on("click", function () {
            members.redirect(APPLICATIONPATH + "membership", true);
            return false;
        });

        $("#membership-button-save").on("click", function () {
            $("#member-details").validate({
                success: function () {
                    members.edit.save();
                },
                onInvalid: function () {
                    corejs.alert("The 'User Details' section has some errors, please correct these before saving.", "e");
                }
            });

            return false;
        });

        $("#membership-button-reset-password").on("click", function () {
            ConfirmationBox.Show($("#reset-password-membership-confirmation"), members.edit.resetPassword);
            return false;
        });

        $("#delete-permission").off("click").on("click", function () {
            members.permissions.deletePermission();
            return false;
        });

        //username validation
        $("#username").on("change keyup", function () {
            var val = $(this).val();
            var regex = /^[a-zA-Z0-9_]*$/;
            if (val.match(regex)) { return true; }
            else {
                //invalid char remove last character from username
                val = val.replace(/[^a-zA-Z0-9_]/, "");
                $(this).val(val);
                corejs.alert("Username must contain only letters, numbers, or underscore.", "e");
                return false;
            }
        });

        //Email validation on defocus
        $("#email").on("focusout", function () {
            var email = $('#email').val();
            var regEx = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var isValidEmail = regEx.test(email);
            if (!isValidEmail) {
                corejs.alert("Please specify a valid email address", "e");
            }
        });

        corejs.bindHelpEvents($("#member-details"));

        members.edit.initialiseMenu();
        ////TODO:PA
        ////members.edit.initialiazeAutoCompleteGrid();

        //userpreferences.initialiseUserPreferenceOptionClickEvent();
        //////permissions.resetView($("#membership-permissions"));
    },
    ////TODO:PA
    ////initialiazeAutoCompleteGrid: function () {
    ////    autocompleteGrid.initialiseWindowWithHidden($("#user-groups-grid"));
    ////    autocompleteGrid.initialiseWindowWithHidden($("#user-location-groups-grid"));
    ////},
    setMenuItemSelected: function ($item) {
        $("#membership-menu li a.selected").removeClass("selected");
        $item.addClass("selected");
    },
    initialiseMenu: function () {

        $("#permission-group").hide();
        $("#new-permission").hide();
        $("#membership-details").on("click", function () {
            members.edit.setMenuItemSelected($("#membership-details"));
            ////autocompleteGrid.hideWindow($("#user-groups-grid"));
            $("#user-groups-wrapper").hide();
            $("#member-section").show();
            $("#user-location-groups-wrapper").hide();
            $("#permission-group").hide();
            $("#user-group-permissions-wrapper").hide();
            $("#user-preferences-wrapper").hide();
            $("#new-permission").hide();
            return false;
        });

        $("#membership-groups").on("click", function () {
            members.edit.setMenuItemSelected($("#membership-groups"));
            ////autocompleteGrid.showWindow($("#user-groups-grid"));
            $("#user-groups-wrapper").show();
            $("#member-section").hide();
            $("#user-location-groups-wrapper").hide();
            $("#permission-group").hide();
            $("#user-group-permissions-wrapper").hide();
            $("#user-preferences-wrapper").hide();
            $("#new-permission").hide();
            return false;
        });

        $("#membership-location-groups").on("click", function () {
            members.edit.setMenuItemSelected($("#membership-location-groups"));
            ////autocompleteGrid.showWindow($("#user-location-groups-grid"));
            $("#user-location-groups-wrapper").show();
            $("#user-groups-wrapper").hide();
            $("#member-section").hide();
            $("#permission-group").hide();
            $("#user-group-permissions-wrapper").hide();
            $("#user-preferences-wrapper").hide();
            $("#new-permission").hide();
            return false;
        });

        $("#membership-permissions").on("click", function () {
            members.edit.setMenuItemSelected($("#membership-permissions"));
            $("#user-location-groups-wrapper").hide();
            $("#user-groups-wrapper").hide();
            $("#member-section").hide();
            $("#permission-group").show();
            $("#new-permission").show();
            //var callback = function () {
            //    window.setTimeout(function() {
            //        $("#CPFCore_UserOrGroupPermissions .search-results").on("selected", function(event, eventArgs) {
            //            members.permissions.enableRibbonButtons(eventArgs);
            //        });
            //    }, 0);
            //}

            //permissions.getUserOrGroupPermissions(callback);
            permissions.getUserOrGroupPermissions();
            $("#user-preferences-wrapper").hide();
        });


        $("#membership-preferences").on("click", function () {
            members.edit.setMenuItemSelected($("#membership-preferences"));
            ////autocompleteGrid.hideWindow($("#user-groups-grid"));
            $("#user-groups-wrapper").hide();
            $("#member-section").hide();
            $("#user-location-groups-wrapper").hide();
            $("#permission-group").hide();
            $("#user-group-permissions-wrapper").hide();
            $("#user-preferences-wrapper").show();
            $("#new-permission").hide();
        });

        corejs.toolbar.initialiseDropDowns();

    },

    getUserGroupData: function () {
        //get user groups
        var userGroups = [];
        ////userGroups = autocompleteGrid.getChanges($("#user-groups-grid"));


        return userGroups;
    },

    getUserLocationGroupData: function () {
        //get user groups
        var userLocationGroups = [];
        ////userLocationGroups = autocompleteGrid.getChanges($("#user-location-groups-grid"));
        return userLocationGroups;
    },

    registersave: function () {
        if ($(this).hasClass("disabled")) {
            return false;
        }

        $("#membership-button-save").addClass("disabled");

        //  var userData = members.edit.getUserGroupData();
        //   var userLocationGroupData = members.edit.getUserLocationGroupData();
        //  var userPreferencesData = userpreferences.getUserPerferencesData($("#user-preferences-wrapper"));
        var $memberDetails = $("#member-section");
        var ajaxData = {};

        ajaxData.userId = $memberDetails.find("#userid").val();
        ajaxData.firstName = $memberDetails.find("#first-name").val();
        ajaxData.lastName = $memberDetails.find("#last-name").val();
        ajaxData.userName = $memberDetails.find("#username").val();
        ajaxData.email = $memberDetails.find("#email").val();
        ajaxData.phone1 = $memberDetails.find("#phone1").val();
        ajaxData.phone2 = $memberDetails.find("#phone2").val();
        ajaxData.language = $memberDetails.find("#user-language").val();
        ajaxData.timeZone = $memberDetails.find("#time-zone").val();
        ajaxData.locked = $memberDetails.find("#locked").is(":checked");
        ajaxData.disabled = $memberDetails.find("#disabled").is(":checked");
        ajaxData.employeeId = $memberDetails.find("#employee-id").val();
        ajaxData.primaryLocationId = $memberDetails.find("#primary-location-id").val();
        // ajaxData.userGroups = userData;
        // ajaxData.userLocationGroups = userLocationGroupData;
        // ajaxData.userPreferencesData = userPreferencesData;
        ajaxData.country = $memberDetails.find("#country").val();
        ajaxData.broker = $memberDetails.find("#broker-id").val();


        corejs.ajax({ url: APPLICATIONPATH + "membership/registersave", success: members.edit.registerSuccess, errorCallback: members.edit.registerFailed, data: ajaxData });
    },
    registerSuccess: function (result, textStatus, jqXHR) {
        //function close_box() {
        $('.backdrop, .box').animate({ 'opacity': '0' }, 300, 'linear', function () {
            $('.backdrop, .box').css('display', 'none');
        });
    },

    registerFailed: function (data, message, exception) {
        return false;
    },

    save: function () {
        if ($(this).hasClass("disabled")) {
            return false;
        }

        $("#membership-button-save").addClass("disabled");

      //  var userData = members.edit.getUserGroupData();
     //   var userLocationGroupData = members.edit.getUserLocationGroupData();
      //  var userPreferencesData = userpreferences.getUserPerferencesData($("#user-preferences-wrapper"));
        var $memberDetails = $("#member-section");
        var ajaxData = {};

        ajaxData.userId = $memberDetails.find("#userid").val();
        ajaxData.firstName = $memberDetails.find("#first-name").val();
        ajaxData.lastName = $memberDetails.find("#last-name").val();
        ajaxData.userName = $memberDetails.find("#username").val();
        ajaxData.email = $memberDetails.find("#email").val();
        ajaxData.phone1 = $memberDetails.find("#phone1").val();
        ajaxData.phone2 = $memberDetails.find("#phone2").val();
        ajaxData.language = $memberDetails.find("#user-language").val();
        ajaxData.timeZone = $memberDetails.find("#time-zone").val();
        ajaxData.locked = $memberDetails.find("#locked").is(":checked");
        ajaxData.disabled = $memberDetails.find("#disabled").is(":checked");
        ajaxData.employeeId = $memberDetails.find("#employee-id").val();
        ajaxData.primaryLocationId = $memberDetails.find("#primary-location-id").val();
       // ajaxData.userGroups = userData;
       // ajaxData.userLocationGroups = userLocationGroupData;
       // ajaxData.userPreferencesData = userPreferencesData;
        ajaxData.country = $memberDetails.find("#country").val();
        ajaxData.broker = $memberDetails.find("#broker-id").val();


        corejs.ajax({ url: APPLICATIONPATH + "membership/save", success: members.edit.saveSuccess, errorCallback: members.edit.saveFailed, data: ajaxData });
    },

    saveSuccess: function (result, textStatus, jqXHR) {
        $("#membership-button-save").removeClass("disabled");
        corejs.spin(false);

        //        if (result.success == "true") {
        //$("#user-id").val(result["data"].UserID);

        // fire an event to say we saved ok, in case we are waiting to navigate away
        $("body").trigger("saved");
        //            corejs.delayedAlert(result.message, "s", false, USERID);
        //            members.redirect(APPLICATIONPATH + result.data.redirect);
        //        } else {
        //            members.edit.saveFailed(null, result.message, null);
        //        }
    },

    saveFailed: function (data, message, exception) {
        corejs.spin(false);
        //corejs.alert(message, "e", true);
        if (data["unhandled"]) {
            corejs.alert("RESOURCE{{members.js}:{FailedToDeleteUser}:{Failed to save the user.}}", "e", true);
        }
        $("#membership-button-save").removeClass("disabled");
    },


    resetPassword: function () {
        var success = function (result) {

            if (result.success) {
                members.redirect(APPLICATIONPATH + "membership", true);
            }
        };

        var fail = function (data, textStatus, jqXHR) {

            //var msg = "RESOURCE{{members.js}:{FailedToResetPassword}:{Failed to reset password {0}.}}";
            //corejs.alert(msg.replace("{0}", textStatus), "e");
            if (data["unhandled"]) {
                corejs.alert("RESOURCE{{members.js}:{FailedToResetPassword}:{Failed to reset password.}}", "e", true);
            }
        }

        // username and and send them to the server.
        var username = $("#username").val();
        corejs.ajax({ url: APPLICATIONPATH + "membership/resetpassword", success: success, errorCallback: fail, data: { "username": username } });
    }
};

//members.permissions = {
//    enableRibbonButtons: function(eventArgs) {
//        var $permissionsSelected = members.permissions.getSelectedPermissionList();
//        if ($permissionsSelected.length > 0) {
//            $("#delete-permission span").gcop().removeClass("disabled");
//        } else {
//            $("#delete-permission span").gcop().addClass("disabled");
//        }

//        return false;
//    },

//    deletePermission: function() {
//        var permissionsSelected = members.permissions.getSelectedPermissionList();

//        if (permissionsSelected.length > 0) {
//            var selectedRowData = [];
//            for (var i = 0; i < permissionsSelected.length; i++) {

//                var rowData = JSON.parse($(permissionsSelected[i]).parent().parent().gcop().getAttribute("data-row"));
//                selectedRowData.push(rowData);
//            }

//            var success = function () { };
//            var fail = function () { };

//            corejs.ajax({ url: APPLICATIONPATH + "permission/delete", success: success, errorCallback: fail, data: { "rowData": JSON.stringify(selectedRowData) } });
//        } else {
//            return false;
//        }
//    },

//    getSelectedPermissionList: function() {
//        return $("#CPFCore_UserOrGroupPermissions .search-results .results-container .item-selection-column input[type=checkbox]:checked");
//    }
//};