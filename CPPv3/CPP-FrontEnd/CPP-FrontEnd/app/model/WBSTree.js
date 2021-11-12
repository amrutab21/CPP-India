WBSTree = (function ($) {
    var obj = function WBSTree() {
        if (!this instanceof WBSTree) {
            return new WBSTree();
        }
        var isFieldValueChanged = false; // Jignesh-31-03-2021
        //luan jquery experimental
        //var table = $('#program_contract_table_id').DataTable();

        //$('#program_contract_table_id tbody').on('click', 'tr', function () {
        //	if ($(this).hasClass('selected')) {
        //		$(this).removeClass('selected');
        //	}
        //	else {
        //		table.$('tr.selected').removeClass('selected');
        //		$(this).addClass('selected');
        //	}
        //});

        //Khoa Code
        // window.addEventListener("scroll", myFunc.bind(this, document.getElementById("wbs-tree")), false);
        window.onscroll = function () {
            myFunc.bind(this, document.getElementById("wbs-tree"));
        };
        var scrollOffset = 0;
        $(".wbs").on("scroll", function () {
            scrollOffset = $(".wbs").scrollTop();
        });
        function myFunc(div) {
            var scroll = document.body.scrollTop;
            div.style.top = (scroll / 10) + "px";
        }

        function removeDoc() {
            alert('hi');
        }


        //Cost overhead type arrays
        var costOverheadTypes = [{
            ID: 1,
            CostOverHeadType: "Billable Rate"
        }, {
            ID: 2,
            CostOverHeadType: "Raw Rate with Multiplier"
        }];
        //used to indicate the id of the node added
        var nodeIdCounter = 0;



        //used for exit modal
        var originalInfo = null;
        var originalFund = null;
        var originalCategory = null;
        var lineWidth = 0;
        var modificationTypeData = null; // jignesh-m
        _duration = 750;
        _path = null;
        _angularscope = null;
        _wbsTrendTree = null;
        _projectMap = null;
        _tree = null;
        _viewerWidth = null;
        _viewerHeight = null;
        _root = null;
        _svgGroup = null;
        _diagonal = null;
        _selectedOrganizationID = null;
        _selectedProjectID = null;
        _selectedNode = null;
        _Program = null;
        _ProgramElement = null;
        _Project = null;
        _Trend = null;
        _FundType = null;
        _selectedProgramID = null;
        _selectedProgramElement = {};
        _selectedProgramElementID = null;
        _organizationList = null;
        _orgProjectName = null;
        _fundTypeList = null;
        _fundToBeAdded = null;
        _fundToBeDeleted = null;
        _orgProgramFund = null;
        _orgProgramCategory = null;
        _ProgramFund = null;
        _filter = null;
        _rootScope = null;
        _modal = null;
        _localStorage = null;
        _Organization = null;
        _projectScopeList = null;
        _scopeToBeAdded = null;
        _scopeToBeDeleted = null;
        _ProjectScope = null;
        _DescriptionList = null;
        _newTrend = null;
        _mainCategory = null;
        _subCategory = null;
        _phaseCode = null;
        _phaseCodeList = null;
        _mainCategoryList = null;
        _subCategoryList = null;
        _categoryToBeAdded = null;
        _categoryToBeDeleted = null;
        _programCategory = null;
        _projectTypeList = null;
        _projectClassList = null;
        _locationList = null;
        _lineOfBusinessList = null;
        _projectNumber = null;
        _projectElementNumber = null;
        _trendStatusCode = null;
        _documentList = null;
        _ProjectWhiteList = null;
        _ProjectWhiteListService = null;
        _ModificationList = null; // Jignesh 29-10-2020
        _IsRootForModification = false; // Jignesh 23-11-2020
        _program = null;
        _deleteDocIDs = [];
        _TrendId = null;
        _Update_contract = null;
        _Update_milestone = null;
        _Update_change_order = null;
        _Contract = null;
        _Program_Contract = null;
        _Selected_Contract = null;

        _Project_Element_Milestone = null;
        _Selected_Project_Element_Milestone = null;

        _Program_Element_Milestone = null;
        _Selected_Program_Element_Milestone = null;
        g_editdocument = null;
        g_document_type_project = null;
        g_document_type_program = null;
        g_editprojectdocument = null;
        g_editelementdocument = null;
        g_edittrenddocument = null;
        g_document_type_element = null;
        g_document_type_trend = null;
        _Program_Element_Change_Order = null;
        _Selected_Program_Element_Change_Order = null;

        _Document = {};
        _Project_File_Draft = [];
        _Program_Element_File_Draft = [];
        _Program_Contract_File_Draft = [];
        _Program_Element_Change_Order_File_Draft = [];
        _Is_Project_New = null;
        _Is_Program_Element_New = null;
        _Is_Program_New = null;
        _Is_Program_Contract_New = null;
        _Is_Program_Element_Change_Order_New = null;
        _Is_Project_Element_Milestone_New = null;
        _Is_Program_Element_Milestone_New = null;
        _Is_Program_Element_Change_Order_New = null;
        _Angular_Http = null;
        var g_selectedContract = null;
        var g_newProgramContract = false;
        var g_newProgram = false;
        var g_contract_draft_list = [];

        //Project Element Milestone globals
        var g_selectedProjectElementMilestone = null;
        var g_newProject = false;
        var g_project_element_milestone_draft_list = [];

        //Program Element Milestone globals
        var g_selectedProgramElementMilestone = null;
        var g_newProgramElement = false;
        var g_program_element_milestone_draft_list = [];

        //Program Element Change Order globals
        var g_selectedProgramElementChangeOrder = null;
        var g_newProgramElement = false;
        var g_program_element_change_order_draft_list = [];

        var g_selectedProjectDocument = null;
        var g_selectedProgramPrgDocument = null;
        var g_selectedElementDocument = null;
        var g_selectedTrendDocument = null;


        //_nodeYPosition = null;  //Manasib 27-03-2021
        //_nodeXPosition = null;  //Manasib 27-03-2021

        function createSomething(request) {
        }

        obj.prototype.setTrendId = function (trendID) {
            _TrendId = trendID;
        }
        obj.prototype.getTrendId = function () {
            return _TrendId;
        }

        obj.prototype.setProjectNumber = function (projectNumber) {
            _projectNumber = projectNumber;
        }
        obj.prototype.getProjectNumber = function () {
            return _projectNumber;
        }
        obj.prototype.setProjectElementNumber = function (projectElementNumber) {
            _projectElementNumber = projectElementNumber;
        }
        obj.prototype.getProjectElementNumber = function () {
            return _projectElementNumber;
        }
        obj.prototype.setQuickbookJobNumber = function (quickbookJobNumber) {
            _quickbookJobNumber = quickbookJobNumber;
        }
        obj.prototype.getQuickbookJobNumber = function () {
            return _quickbookJobNumber;
        }
        obj.prototype.setScope = function (scope) {
            if (scope) {
                _angularscope = scope;
            }
        }
        obj.prototype.getScope = function () {
            return _angularscope;
        }
        obj.prototype.setRootScope = function (rootScope) {
            if (rootScope)
                _rootScope = rootScope;
        }
        obj.prototype.getRootScope = function () {
            return _rootScope;
        }
        obj.prototype.getLocalStorage = function () {
            return _localStorage;
        }
        obj.prototype.setLocalStorage = function (localStorage) {
            if (localStorage)
                _localStorage = localStorage;
        }
        obj.prototype.setModal = function (modal) {
            if (modal)
                _modal = modal;
        }
        obj.prototype.getModal = function () {
            return _modal;
        }
        obj.prototype.setProjectMap = function (projectMap) {
            if (projectMap) {
                _projectMap = projectMap;
            }
        }
        obj.prototype.getProjectMap = function () {
            return _projectMap;
        }
        obj.prototype.setWBSTrendTree = function (wbsTrendTree) {
            if (wbsTrendTree) {
                _wbsTrendTree = wbsTrendTree;
            }
        }
        obj.prototype.getWBSTrendTree = function () {
            return _wbsTrendTree;
        }
        obj.prototype.setTree = function (tree) {
            if (tree) {
                _tree = tree;
            }
        }
        obj.prototype.setViewerWidth = function (viewerWidth) {
            if (viewerWidth) {
                _viewerWidth = viewerWidth;
            }
        }
        obj.prototype.setViewerHeight = function (viewerHeight) {
            if (viewerHeight) {
                _viewerHeight = viewerHeight;
            }
        }
        obj.prototype.setDiagonal = function (diagonal) {
            if (diagonal) {
                _diagonal = diagonal;
            }
        }
        obj.prototype.setSelectedOrganizationID = function (selectedOrganizationID) {
            console.log(selectedOrganizationID);
            if (selectedOrganizationID) {
                _selectedOrganizationID = selectedOrganizationID;
            }
        }
        obj.prototype.getSelectedOrganizationID = function () {
            return _selectedOrganizationID;
        }
        obj.prototype.setSelectedProjectID = function (selectedProjectID) {
            if (selectedProjectID) {
                _selectedProjectID = selectedProjectID;
            }
        }
        obj.prototype.getSelectedProjectID = function () {
            return _selectedProjectID;
        }
        obj.prototype.setSelectedProgramElementID = function (selectedProgramElementID) {
            if (selectedProgramElementID) {
                _selectedProgramElementID = selectedProgramElementID;
            }
        }
        obj.prototype.getSelectedProgramElementID = function () {
            return _selectedProgramElementID;
        }
        obj.prototype.setSelectedProgramID = function (selectedProgramID) {
            if (selectedProgramID) {
                _selectedProgramID = selectedProgramID;
            }
        }
        obj.prototype.getSelectedProgramID = function () {
            return _selectedProgramID;
        }
        obj.prototype.setOrgProjectName = function (orgProjectName) {

            _orgProjectName = orgProjectName;
        }
        obj.prototype.getOrgProjectName = function () {
            return _orgProjectName;
        }
        obj.prototype.setSelectedNode = function (selectedNode) {
            _selectedNode = selectedNode;
            console.log("selectedNode==");
            console.log(selectedNode);
        }
        obj.prototype.getSelectedNode = function () {
            return _selectedNode;
        }
        obj.prototype.setProgram = function (Program) {
            if (Program) {
                _Program = Program;
            }
        }
        obj.prototype.getProgram = function () {
            return _Program;
        }
        obj.prototype.setFundType = function (FundType) {
            if (FundType)
                _FundType = FundType;
        }
        obj.prototype.getFundType = function () {
            return _FundType;
        }
        obj.prototype.setFundTypeList = function (fundTypeList) {
            if (fundTypeList)
                _fundTypeList = fundTypeList;
        }
        obj.prototype.getFundTypeList = function () {
            return _fundTypeList;
        }
        obj.prototype.setProgramElement = function (ProgramElement) {
            if (ProgramElement) {
                _ProgramElement = ProgramElement;
            }
        }
        obj.prototype.getProgramElement = function () {
            return _ProgramElement;
        }
        obj.prototype.setProject = function (Project) {
            if (Project) {
                _Project = Project;
            }
        }
        obj.prototype.getProject = function () {
            return _Project;
        }
        obj.prototype.setTrend = function (Trend) {
            if (Trend) {
                _Trend = Trend;
            }
        }
        obj.prototype.getTrend = function () {
            return _Trend;
        }
        obj.prototype.setOrganizationList = function (organizationList) {
            if (organizationList) {
                _organizationList = organizationList;
            }
        }
        obj.prototype.getOrganizationList = function () {
            return _organizationList;
        }
        obj.prototype.setFundToBeAdded = function (fundToBeAdded) {
            if (fundToBeAdded)
                _fundToBeAdded = fundToBeAdded;
        }
        obj.prototype.getFundToBeAdded = function () {
            return _fundToBeAdded;
        }
        obj.prototype.setFundToBeDeleted = function (fundToBeDeleted) {
            if (fundToBeDeleted)
                _fundToBeDeleted = fundToBeDeleted;
        }
        obj.prototype.getFundToBeDeleted = function () {
            return _fundToBeDeleted;
        };
        obj.prototype.getProgramFund = function () {
            return _ProgramFund
        }
        obj.prototype.setProgramFund = function (ProgramFund) {
            if (ProgramFund)
                _ProgramFund = ProgramFund;
        }
        obj.prototype.getOrgProgramFund = function () {
            return _orgProgramFund
        };
        obj.prototype.getOrgProgramCategory = function () {
            return _orgProgramCategory;
        }
        obj.prototype.setDescriptionList = function (DescriptionList) {
            if (DescriptionList)
                _DescriptionList = DescriptionList;
        }
        obj.prototype.getDescriptionList = function () {
            return _DescriptionList;
        };
        obj.prototype.setOrgProgramFund = function (orgProgramFund) {
            if (orgProgramFund) {
                _orgProgramFund = orgProgramFund;
            }
        }
        obj.prototype.setOrgProgramCategory = function (orgProgramCategory) {
            if (orgProgramCategory)
                _orgProgramCategory = orgProgramCategory;
        }
        obj.prototype.getOrganizationService = function () {
            return _Organization;
        }
        obj.prototype.setOrganizationService = function (org) {
            if (org)
                _Organization = org;
        }

        obj.prototype.getContract = function () {
            return _Contract;
        }
        obj.prototype.setContract = function (contract) {
            if (contract)
                _Contract = contract;
        }

        obj.prototype.getMilestone = function () {
            return _Milestone;
        }
        obj.prototype.setMilestone = function (milestone) {
            if (milestone)
                _Milestone = milestone;
        }

        obj.prototype.getChangeOrder = function () {
            return _ChangeOrder;
        }
        obj.prototype.setChangeOrder = function (changeOrder) {
            if (changeOrder)
                _ChangeOrder = changeOrder;
        }

        obj.prototype.getProgramContract = function () {
            return _Program_Contract;
        }
        obj.prototype.setProgramContract = function (program_contract) {
            if (program_contract)
                _Program_Contract = program_contract;
        }

        obj.prototype.setMainCategory = function (cat) {
            if (cat)
                _mainCategory = cat;
        }
        obj.prototype.getMainCategory = function () {
            return _mainCategory;
        }
        obj.prototype.setSubCategory = function (cat) {
            if (cat) {
                _subCategory = cat;
            }
        }
        obj.prototype.getSubCategory = function (cat) {
            return _subCategory;
        }
        obj.prototype.setPhaseCode = function (phase) {
            if (phase)
                _phaseCode = phase;
        }
        obj.prototype.getPhaseCode = function () {
            return _phaseCode;
        }
        obj.prototype.setTrendStatusCode = function (trendStatusCode) {
            if (trendStatusCode)
                _trendStatusCode = trendStatusCode;
        }
        obj.prototype.getTrendStatusCode = function () {
            return _trendStatusCode;
        }
        obj.prototype.getPhaseCodeList = function () {
            return _phaseCodeList;
        }
        obj.prototype.setPhaseCodeList = function (phaseList) {
            if (phaseList)
                _phaseCodeList = phaseList;
        }
        obj.prototype.getMainCategoryList = function () {
            return _mainCategoryList;
        }
        obj.prototype.setMainCategoryList = function (categoryList) {
            if (categoryList)
                _mainCategoryList = categoryList;
        }
        obj.prototype.getSubCategoryList = function () {
            return _subCategoryList;
        }
        obj.prototype.setSubCategoryList = function (subCategoryList) {
            if (subCategoryList)
                _subCategoryList = subCategoryList;
        }
        obj.prototype.setCategoryToBeAdded = function (categoryToBeAdded) {
            if (categoryToBeAdded)
                _categoryToBeAdded = categoryToBeAdded;
        }
        obj.prototype.getCategoryToBeAdded = function () {
            return _categoryToBeAdded;
        }
        obj.prototype.setCategoryToBeDeleted = function (categoryToBeDeleted) {
            if (categoryToBeDeleted)
                _categoryToBeDeleted = categoryToBeDeleted;
        }
        obj.prototype.getCategoryToBeDeleted = function () {
            return _categoryToBeDeleted;
        }
        obj.prototype.getProgramCategory = function () {
            return _programCategory;
        }
        obj.prototype.setProgramCategory = function (ProgramCategory) {
            if (ProgramCategory)
                _programCategory = ProgramCategory;
        }

        obj.prototype.getSelectedContract = function () {
            return _Selected_Contract;
        }
        obj.prototype.setSelectedContract = function (contract) {
            if (contract)
                _Selected_Contract = contract;
        }

        obj.prototype.getSelectedProjectElementMilestone = function () {
            return _Selected_Project_Element_Milestone;
        }
        obj.prototype.setSelectedProjectElementMilestone = function (milestone) {
            if (milestone)
                _Selected_Project_Element_Milestone = milestone;
        }

        obj.prototype.getSelectedProgramElementMilestone = function () {
            return _Selected_Program_Element_Milestone;
        }
        obj.prototype.setSelectedProgramElementMilestone = function (milestone) {
            if (milestone)
                _Selected_Program_Element_Milestone = milestone;
        }

        obj.prototype.getSelectedProgramElementChangeOrder = function () {
            return _Selected_Program_Element_Change_Order;
        }
        obj.prototype.setSelectedProgramElementChangeOrder = function (changeOrder) {
            if (changeOrder)
                _Selected_Program_Element_Change_Order = changeOrder;
        }

        obj.prototype.getProjectFileDraft = function () {
            return _Project_File_Draft;
        }
        obj.prototype.setProjectFileDraft = function (projectFileDraft) {
            _Project_File_Draft = projectFileDraft;
        }

        obj.prototype.getProjectFileDraft = function () {
            return _Project_File_Draft;
        }
        obj.prototype.setProjectFileDraft = function (projectFileDraft) {
            _Project_File_Draft = projectFileDraft;
        }

        obj.prototype.getIsProjectNew = function () {
            return _Is_Project_New;
        }
        obj.prototype.setIsProjectNew = function (isProjectNew) {
            if (isProjectNew)
                _Is_Project_New = isProjectNew;
        }

        obj.prototype.getProgramElementFileDraft = function () {
            return _Program_Element_File_Draft;
        }
        obj.prototype.setProgramElementFileDraft = function (programElementFileDraft) {
            _Program_Element_File_Draft = programElementFileDraft;
        }

        obj.prototype.getProgramElementFileDraft = function () {
            return _Program_Element_File_Draft;
        }
        obj.prototype.setProgramElementFileDraft = function (programElementFileDraft) {
            _Program_Element_File_Draft = programElementFileDraft;
        }

        obj.prototype.getIsProgramElementNew = function () {
            return _Is_Program_Element_New;
        }
        obj.prototype.setIsProgramElementNew = function (isProgramElementNew) {
            if (isProgramElementNew)
                _Is_Program_Element_New = isProgramElementNew;
        }

        obj.prototype.getProgramContractFileDraft = function () {
            return _Program_Contract_File_Draft;
        }
        obj.prototype.setProgramContractFileDraft = function (programContractFileDraft) {
            _Program_Contract_File_Draft = programContractFileDraft;
        }

        obj.prototype.getProgramElementChangeOrderFileDraft = function () {
            return _Program_Element_Change_Order_File_Draft;
        }
        obj.prototype.setProgramElementChangeOrderFileDraft = function (programElementChangeOrderFileDraft) {
            _Program_Element_Change_Order_File_Draft = programElementChangeOrderFileDraft;
        }

        obj.prototype.getIsProgramNew = function () {
            return _Is_Program_New;
        }
        obj.prototype.setIsProgramNew = function (isProgramNew) {
            if (isProgramNew)
                _Is_Program_New = isProgramNew;
        }

        obj.prototype.getIsProgramContractNew = function () {
            return _Is_Program_Contract_New;
        }
        obj.prototype.setIsProgramContractNew = function (isProgramContractNew) {
            if (isProgramContractNew)
                _Is_Program_Contract_New = isProgramContractNew;
        }

        obj.prototype.getIsProgramElementChangeOrderNew = function () {
            return _Is_Program_Element_Change_Order_New;
        }
        obj.prototype.setIsProgramElementChangeOrderNew = function (isProgramElementChangeOrderNew) {
            if (isProgramElementChangeOrderNew)
                _Is_Program_Element_Change_Order_New = isProgramElementChangeOrderNew;
        }

        obj.prototype.getAngularHttp = function () {
            return _Angular_Http;
        }
        obj.prototype.setAngularHttp = function (angularHttp) {
            _Angular_Http = angularHttp;
        }

        obj.prototype.getSelectedDocument = function () {
            return _Document;
        }
        obj.prototype.setSelectedDocument = function (document) {
            if (document.DocumentID > 0)
                _Document = document;
        }

        obj.prototype.getSelectedProgramElementChangeOrderDocument = function () {
            return _Document;
        }
        obj.prototype.setSelectedProgramElementChangeOrderDocument = function (document) {
            if (document.DocumentID > 0)
                _Document = document;
        }

        obj.prototype.getProjectTypeList = function () {    //Already in list form of data
            return _projectTypeList;
        }
        obj.prototype.setProjectTypeList = function (projectTypeList) { //Already in list form of data
            if (projectTypeList)
                _projectTypeList = projectTypeList;
            console.log(projectTypeList);
        }
        obj.prototype.getContractList = function () {    //Already in list form of data
            return _contractList;
        }
        obj.prototype.setContractList = function (contractList) { //Already in list form of data
            if (contractList)
                _contractList = contractList;
            console.log(contractList);
        }

        obj.prototype.getMilestoneList = function () {    //Already in list form of data
            return _milestoneList;
        }
        obj.prototype.setMilestoneList = function (milestoneList) { //Already in list form of data
            if (milestoneList)
                _milestoneList = milestoneList;
            console.log(milestoneList);
        }

        obj.prototype.getChangeOrderList = function () {    //Already in list form of data
            return _changeOrderList;
        }
        obj.prototype.setChangeOrderList = function (changeOrderList) { //Already in list form of data
            if (changeOrderList)
                _changeOrderList = changeOrderList;
            console.log(changeOrderList);
        }

        obj.prototype.getProjectClassList = function () {   //Already in list form of data
            return _projectClassList;
        }
        obj.prototype.setProgramContractList = function (programContractList) { //Already in list form of data
            if (programContractList)
                _programContractList = programContractList;
            console.log(programContractList);
        }
        obj.prototype.getProgramContractList = function () {   //Already in list form of data
            return _programContractList;
        }
        obj.prototype.setProjectClassList = function (projectClassList) {   //Already in list form of data
            if (projectClassList)
                _projectClassList = projectClassList;
        }
        obj.prototype.setServiceClassList = function (serviceClassList) {   //Already in list form of data
            if (serviceClassList)
                _serviceClassList = serviceClassList;
        }
        obj.prototype.getServiceClassList = function () {   //Already in list form of data
            return _serviceClassList;
        }
        obj.prototype.getLocationList = function () {   //Already in list form of data
            return _LocationList;
        }
        obj.prototype.setLocationList = function (locationList) {   //Already in list form of data
            if (locationList)
                _locationList = locationList;
        }
        obj.prototype.getLineOfBusinessList = function () {
            return _lineOfBusinessList;
        }
        obj.prototype.setLineOfBusinessList = function (lineOfBusinessList) {
            if (lineOfBusinessList)
                _lineOfBusinessList = lineOfBusinessList;
        }
        obj.prototype.getClientList = function () {   //Already in list form of data
            return _clientList;
        }
        obj.prototype.setClientList = function (clientList) {   //Already in list form of data
            if (clientList)
                _clientList = clientList;
        }
        obj.prototype.getLocationList = function () {   //Already in list form of data
            return _locationList;
        }
        obj.prototype.setLocationList = function (locationList) {   //Already in list form of data
            if (locationList)
                _locationList = locationList;
        }
        obj.prototype.getUserList = function () {   //Already in list form of data
            return _userList;
        }
        obj.prototype.setUserList = function (userList) {   //Already in list form of data
            if (userList)
                _userList = userList;
        }
        obj.prototype.getEmployeeList = function () {   //Already in list form of data
            return _employeeList;
        }
        obj.prototype.setEmployeeList = function (employeeList) {   //Already in list form of data
            if (employeeList)
                _employeeList = employeeList;
        }

        obj.prototype.getDocTypeList = function () {   //Already in list form of data
            return _docTypeList;
        };
        obj.prototype.setDocTypeList = function (docTypeList) {   //Already in list form of data
            if (docTypeList)
                _docTypeList = docTypeList;
        };
        //======================================= Jignesh-AddNewDocModal-18-02-2021 ==========================================
        obj.prototype.getSelectedDocTypeDropDown = function () {
            return _selectedDocTypeDD;
        };
        obj.prototype.setSelectedDocTypeDropDown = function (docTypeDD) {
            if (docTypeDD)
                _selectedDocTypeDD = docTypeDD;
        };
        //=======================================================================================================
        obj.prototype.getDocument = function () {   //Already in list form of data
            return _Document;
        };
        obj.prototype.setDocument = function (Document) {   //Already in list form of data
            if (Document) {
                _Document = Document;
            }
        };

        obj.prototype.getProjectWhiteList = function () {   //Already in list form of data
            return _ProjectWhiteList;
        };
        obj.prototype.setProjectWhiteList = function (ProjectWhiteList) {   //Already in list form of data
            if (ProjectWhiteList) {
                _ProjectWhiteList = ProjectWhiteList;
            }
        };

        obj.prototype.getProjectWhiteListService = function () {   //Service
            return _ProjectWhiteListService;
        };
        obj.prototype.setProjectWhiteListService = function (ProjectWhiteListService) {   //Service
            if (ProjectWhiteListService) {
                _ProjectWhiteListService = ProjectWhiteListService;
            }
        };

        obj.prototype.getUpdateProjectWhiteList = function (projectID) {   //Service
            return _UpdateProjectWhiteList;
        };
        obj.prototype.setUpdateProjectWhiteList = function (UpdateProjectWhiteList) {   //Service
            if (UpdateProjectWhiteList) {
                _UpdateProjectWhiteList = UpdateProjectWhiteList;
            }
        };

        obj.prototype.getUpdateContract = function (projectID) {   //Service
            return _Update_contract;
        };
        obj.prototype.setUpdateContract = function (UpdateContract) {   //Service
            if (UpdateContract) {
                _Update_contract = UpdateContract;
            }
        };

        obj.prototype.getUpdateMilestone = function (projectID) {   //Service
            return _Update_milestone;
        };
        obj.prototype.setUpdateMilestone = function (UpdateMilestone) {   //Service
            if (UpdateMilestone) {
                _Update_milestone = UpdateMilestone;
            }
        };

        obj.prototype.getUpdateChangeOrder = function (projectID) {   //Service
            return _Update_change_order;
        };
        obj.prototype.setUpdateChangeOrder = function (UpdateChangeOrder) {   //Service
            if (UpdateChangeOrder) {
                _Update_change_order = UpdateChangeOrder;
            }
        };

        obj.prototype.setDocumentList = function (documentList) {
            if (documentList)
                _documentList = documentList;
        };

        obj.prototype.setDeleteDocIDs = function (deleteDocIDs) {
            if (deleteDocIDs)
                _deleteDocIDs.push(deleteDocIDs);
            else
                _deleteDocIDs = [];
        };
        obj.prototype.getDeleteDocIDs = function () {   //Already in list form of data
            return _deleteDocIDs;
        };

        //====================Manasi 27-03-2021=====================================
        //obj.prototype.setNodeXPosition = function (nodeXPosition) {
        //    _nodeXPosition = nodeXPosition;
        //}

        //obj.prototype.setNodeYPosition = function (nodeYPosition) {
        //    _nodeYPosition = nodeYPosition;
        //}

        //obj.prototype.getNodeXPosition = function () {
        //    if (_nodeXPosition)
        //        return _nodeXPosition;
        //}

        //obj.prototype.getNodeYPosition = function () {
        //    if (_nodeYPosition)
        //        return _nodeYPosition;
        //}
        //========================================================================================================


        obj.prototype.renderTreeGrid = function (treeData, svgGroup, zoomListener) {
            Treedata = treeData;
            // Define the root
            var root = treeData;
            _root = root;
            _svgGroup = svgGroup;
            console.log(_viewerHeight);
            root.x0 = _viewerHeight / 2;
            root.y0 = 0;
            // root.x0 = _viewerWidth/2;
            var svgHeight = svgGroup[0].parentNode.clientHeight;
            var svgWidthUnit = svgGroup[0].parentNode.clientWidth / 10;
            var svgWidthUnit = 180;
            //Khoa code
            var levelWidth = [1];

            childCount(levelWidth, 0, _root);
            var tempHeight = d3.max(levelWidth) * 100; // 25 pixels per line
            //d3.select("#tree-container").select("svg") .attr("height")
            if (svgHeight < tempHeight)
                svgHeight = tempHeight;
            d3.select("#tree-container").select("svg").attr("height", svgHeight);

            var svgWidthUnit = _viewerWidth / 4;
            lineWidth = svgWidthUnit;
            //Add text headings and lines
            /*
             svgGroup.append("text")
             .attr("x", 0)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "18px")
             .style("text-decoration", "underline")
             .text("Organization");
 
             svgGroup.append("text")
             .attr("x", svgWidthUnit * 1)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "18px")
             .style("text-decoration", "underline")
             .text("Program");
 
             svgGroup.append("text")
             .attr("x", svgWidthUnit * 2)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "18px")
             .style("text-decoration", "underline")
             .text("Program Element");
 
             svgGroup.append("text")
             .attr("x", svgWidthUnit * 3)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "18px")
             .style("text-decoration", "underline")
             .text("Project");
             */

            /*
             svgGroup.append("text")
             .attr("x", svgWidthUnit*4.35)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "12px")
             .style("text-decoration", "underline")
             .text("Past");
 
             svgGroup.append("text")
             .attr("x", svgWidthUnit*5.5)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "12px")
             .style("text-decoration", "underline")
             .text("Current");
 
 
             svgGroup.append("text")
             .attr("x", svgWidthUnit*6.5)
             .attr("y", -10)
             .attr("text-anchor", "middle")
             .style("font-size", "12px")
             .style("text-decoration", "underline")
             .text("Future");
             */

            // Layout the tree initially and view on the root node.

            this.updateTreeNodes(root);

            if (root.children != null) {
                if (root.children[0].children != null) {
                    //centerNode(root.children[0].children[0]);
                } else {
                    //centerNode(root.children[0]);
                }
            }

            //updateTreeNodes(root);

            var line1 = svgGroup.append("line")
                .attr("x1", svgWidthUnit * 0.5)
                .attr("y1", 10)
                .attr("x2", svgWidthUnit * 0.5)
                .attr("y2", svgHeight)
                .attr("stroke-width", 0.3)
                .attr("stroke", "grey");
            console.log(line1);

            var line2 = svgGroup.append("line")
                .attr("x1", svgWidthUnit * 1.5)
                .attr("y1", 10)
                .attr("x2", svgWidthUnit * 1.5)
                .attr("y2", svgHeight)
                .attr("stroke-width", 0.3)
                .attr("stroke", "grey");

            var line4 = svgGroup.append("line")
                .attr("x1", svgWidthUnit * 2.5)
                .attr("y1", 10)
                .attr("x2", svgWidthUnit * 2.5)
                .attr("y2", svgHeight)
                .attr("stroke-width", 0.3)
                .attr("stroke", "grey");

            var line3 = svgGroup.append("line")
                .attr("x1", -100)
                .attr("y1", 10)
                .attr("x2", svgWidthUnit * 3.5)
                .attr("y2", 10)
                .attr("stroke-width", 0.3)
                .attr("stroke", "grey");
            /*
 
             var line4 = svgGroup.append("line")
             .attr("x1", svgWidthUnit*3.8)
             .attr("y1", -10)
             .attr("x2", svgWidthUnit*3.8)
             .attr("y2", svgHeight)
             .attr("stroke-width", 0.3)
             .attr("stroke", "grey");
 
             var line5 = svgGroup.append("line")
             .attr("x1", svgWidthUnit*4.9)
             .attr("y1", -10)
             .attr("x2", svgWidthUnit*4.9)
             .attr("y2", svgHeight)
             .attr("stroke-width", 0.3)
             .attr("stroke", "grey");
 
             var line6 = svgGroup.append("line")
             .attr("x1", svgWidthUnit*6.1)
             .attr("y1", -10)
             .attr("x2", svgWidthUnit*6.1)
             .attr("y2", svgHeight)
             .attr("stroke-width", 0.3)
             .attr("stroke", "grey");
 
             var line7 = svgGroup.append("line")
             .attr("x1", svgWidthUnit*7.2)
             .attr("y1", -10)
             .attr("x2", svgWidthUnit*7.2)
             .attr("y2", svgHeight)
             .attr("stroke-width", 0.3)
             .attr("stroke", "grey");*/

            //adjust parent container
            var svg_rect = svgGroup[0][0].getBBox()

            var xOffset = svg_rect.x;
            var yOffset = svg_rect.y;

            var g_width = svg_rect.width;
            var g_height = svg_rect.height + 200;
            $("#wbs-tree").css("height", g_height + "px");
            //$("#tree-container").css("height", g_height+"px");

            var col_width = (_viewerWidth / 4);
            $(".wbs-col-heading").css("width", col_width + "px");
            $(".wbs-col-heading").css("padding-left", "0px");
            $(".wbs-col-heading").css("margin-left", "0px");
            $(".wbs-col-heading").css("padding-right", "0px");
            $(".wbs-col-heading").css("margin-right", "0px");

            var scale = zoomListener.scale();
            var x = col_width / 2;
            var y = 0;
            d3.select('g').transition()
                .duration(_duration)
                .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
            //.on('end', function () {
            //    alert()
            //});
            //console.log(wbsTree.getLocalStorage().userName);
            console.log(localStorage);

            this.getProjectMap().initProjectMap(this.getSelectedNode(), this.getOrganizationList());
            //this.getWBSTrendTree().trendGraphNoProject();
        }
        obj.prototype.setFilter = function (filter) {
            if (filter)
                _filter = filter;
        }
        obj.prototype.getFilter = function () {
            return _filter;
        }
        obj.prototype.setProjectScopeList = function (projectScopeList) {
            if (projectScopeList)
                _projectScopeList = projectScopeList;
        }
        obj.prototype.getProjectScopeList = function () {
            return _projectScopeList;
        }
        obj.prototype.setScopeToBeAdded = function (scopeToBeAdded) {
            if (scopeToBeAdded) {
                _scopeToBeAdded = scopeToBeAdded;
            }
        }
        obj.prototype.getScopeToBeAdded = function () {
            return _scopeToBeAdded;
        }
        obj.prototype.setScopeToBeDeleted = function (scopeToBeDeleted) {
            if (scopeToBeDeleted) {
                _scopeToBeDeleted = scopeToBeDeleted;
            }
        }
        obj.prototype.getScopeToBeDeleted = function () {
            return _scopeToBeDeleted;
        }
        obj.prototype.setProjectScope = function (ProjectScope) {
            if (ProjectScope) {
                _ProjectScope = ProjectScope;
            }
        }
        obj.prototype.getProjectScope = function () {
            return _ProjectScope;
        }
        obj.prototype.getNewTrend = function () {

            return _newTrend;
        }
        obj.prototype.setNewTrend = function (newTrend) {

            _newTrend = newTrend;
        }
        var childCount = function (levelWidth, level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(levelWidth, level + 1, d);
                });
            }
        };

        obj.prototype.updateTreeNodes = function (source) {
            console.debug("SOURCE", source);

            // Compute the new height, function counts total children of root node and sets tree height accordingly.
            // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
            // This makes the layout more consistent.
            var levelWidth = [1];

            childCount(levelWidth, 0, _root);
            var newHeight = d3.max(levelWidth) * 100; // 25 pixels per line
            _tree = _tree.size([newHeight, _viewerWidth]);
            if (newHeight <= 823)
                newHeight = 823;
            d3.select("#tree-container").select("svg").style("height", newHeight); //Khoa Code

            // Compute the new tree layout.
            var nodes = _tree.nodes(_root).reverse(),
                links = _tree.links(nodes);

            // Set widths between levels based on maxLabelLength.
            nodes.forEach(function (d) {
                //var scaledOffset = _viewerWidth / 120; // default was 7
                //d.y = (d.depth * (maxLabelLength * scaledOffset)); //maxLabelLength * 10px
                var col_width = _viewerWidth / 4;
                d.y = d.depth * col_width;
                if (d.depth > 0) {
                    d.y = (d.depth * (col_width)) - (col_width / 2) + 50;
                }
                // alternatively to keep a fixed scale one can set a fixed depth per level
                // Normalize for fixed-depth by commenting out below line
                // d.y = (d.depth * 500); //500px per level.
            });

            // Update the nodes…
            var node = _svgGroup.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++nodeIdCounter);
                });

            var wbsTree = this;

            var gridView = $('#wbsGridView Table td a');



            var contextMenu = document.getElementById("contextMenu");

            function displayMenu(type, e, d) {
                console.log(d);
                $("#contextMenu").attr('contextType', type);

                var contextMenuAddText;
                var contextMenuEditText;

                $("#contextMenuAdd").parent().hide();
                $("#contextMenuEdit").parent().hide();
                $("#contextMenuDelete").parent().hide();
                // Pritesh change all acl index on 4th to 5th Aug as it was not properly  mapped with DB record
                if (type == "Root") {
                    if (wbsTree.getLocalStorage().acl[1] == 1) {
                        contextMenuAddText = "Add Contract";
                        contextMenuEditText = "Edit/Open Organization";

                        $("#contextMenuEdit").parent().hide();
                        $("#contextMenuAdd").parent().show();
                    }
                }
                else if (type == "Program") {
                    if (wbsTree.getLocalStorage().acl[3] == 1) {
                        contextMenuAddText = "Add Project";
                        $("#contextMenuAdd").parent().show();
                    }
                    if (wbsTree.getLocalStorage().acl[0] == 1) {
                        contextMenuEditText = "Open Contract";
                        $("#contextMenuEdit").parent().show();

                    }
                    if (wbsTree.getLocalStorage().acl[1] == 1) {
                        contextMenuEditText = "Edit/Open Contract";
                        $("#contextMenuEdit").parent().show();
                        $("#contextMenuDelete").parent().show();
                    }
                }
                else if (type == "ProgramElement") {
                    if (wbsTree.getLocalStorage().acl[5] == 1) {
                        contextMenuAddText = "Add Element";
                        $("#contextMenuAdd").parent().show();
                    }
                    if (wbsTree.getLocalStorage().acl[2] == 1) {
                        contextMenuEditText = "Open Project";
                        $("#contextMenuEdit").parent().show();

                    }
                    if (wbsTree.getLocalStorage().acl[3] == 1) {
                        contextMenuEditText = "Edit/Open Project";
                        $("#contextMenuEdit").parent().show();
                        $("#contextMenuDelete").parent().show();
                    }
                }
                else if (type == "Project") {
                    if (wbsTree.getLocalStorage().acl[7] == 1) {
                        contextMenuAddText = "Add Trend";
                        $("#contextMenuAdd").parent().show();
                    }
                    if (wbsTree.getLocalStorage().acl[4] == 1) {
                        contextMenuEditText = "Open Element";
                        $("#contextMenuEdit").parent().show();

                    }
                    if (wbsTree.getLocalStorage().acl[5] == 1) {
                        contextMenuEditText = "Edit/Open Element";
                        $("#contextMenuEdit").parent().show();
                        $("#contextMenuDelete").parent().show();
                    }
                }
                //else {
                //    contextMenuAddText = "Add New";
                //    contextMenuEditText = "Edit/Open";
                //}

                if (contextMenuAddText) $("#contextMenuAdd").html(contextMenuAddText);
                if (contextMenuEditText) $("#contextMenuEdit").html(contextMenuEditText);


                if (type == "Root") {
                    //$("#contextMenuAdd").parent().show();

                    $("#contextMenuDelete").parent().hide();
                    $("#contextMenuScope").parent().hide();
                    $("#contextMenuMap").parent().show();
                    //$("#contextMenuProjectScope").parent().hide();
                } else {
                    //$("#contextMenuAdd").parent().show();

                    if (type == "Project") {
                        $("#contextMenuScope").parent().show();
                        //$("#contextMenuProjectScope").parent().hide();
                    }
                    else
                        $("#contextMenuScope").parent().hide();
                    //$("#contextMenuEdit").parent().show();
                    //$("#contextMenuDelete").parent().show();
                    $("#contextMenuMap").parent().hide();
                }

                /*var svg_graph = d3.select("#wbsGridView").selectAll("table td");
                var svg_rect = svg_graph[0][0].getBoundingClientRect();
                var zoom = d3.behavior.zoom();
                var g_scale = zoom.scale();

                var xOffset = svg_rect.x;
                var yOffset = svg_rect.y;


                var pageY = d.x0 + 200 - (yOffset * g_scale);
                var pageX = d.y0 - 50 - (xOffset * g_scale);*/

                //var div = document.getElementById("wbsGridView");
                //var rect = div.getBoundingClientRect();
                //var x = e.clientX + 200 - (rect.left * 2);
                //var y = e.clientY - 50 - (rect.top * 2);
                var element = d3.select(d);
                console.log(element.node());
                //var svg_rect = element[0].getBoundingClientRect();
                //console.log(svg_rect);
                contextMenu.style.display = 'block';
                contextMenu.style.position = "absolute";
                //contextMenu.style.left = e.clientX + "px";
                //contextMenu.style.top = e.clientY + 100 + "px";


                //Get current Browser zoom level
                var browserZoom = ((window.outerWidth - 10) / window.innerWidth);
                browserZoom = (browserZoom < 1) ? browserZoom : 1;

                //0.7 and 0.9 zoom level on a 1366 not working properly
                if (window.outerWidth <= 1366 && (browserZoom >= 0.7 && browserZoom <= 1))
                    browserZoom = 1;

                var mediaZoom = $('html').css('zoom');
                var scaleX = $('html').css('transform').split(',')[0];
                var scaleY = $('html').css('transform').split(',')[3];
                scaleY = (scaleY) ? scaleY.trim() : 1;
                scaleX = (scaleX) ? scaleX.split('(')[1] : scaleX;
                scaleX = (scaleX) ? scaleX : 1;

                var currentZoom = ((window.outerWidth - 10) / window.innerWidth);
                currentZoom = (currentZoom > 1) ? currentZoom : 1;
                var pageXx = e.pageX;
                var pageYy = e.pageY;
                //$("#contextMenu").css({
                //    display: "block",
                //    left: (pageXx * currentZoom), //the position of the mouse is different relatvie to the screen based on the brwoser zoom
                //    top: (pageYy * currentZoom)
                //left: ((pageXx / mediaZoom) / scaleX) * browserZoom,
                //    top: (((pageYy / mediaZoom) / scaleY) * browserZoom) + $('body').scrollTop()
                //});


                console.log(e.pageX, e.pageY);
                console.log(d.x0, d.y0);
                contextMenu.style.left = (((pageXx / mediaZoom) / scaleX) * browserZoom) + "px",
                    contextMenu.style.top = ((((pageYy / mediaZoom) / scaleY) * browserZoom) + $('body').scrollTop()) + "px";
                contextMenu.style.marginLeft = "-4%";
                e.preventDefault();

                return false;

            }


            gridView.on('click', function (d) {
                console.debug(d);
                $('svg.trendTree g').show();
                type = $(this).attr('level');
                if (type == "Root") {
                    SelectedOrganizationId = $(this).attr('OrganizationId');
                    if (Treedata.OrganizationID == SelectedOrganizationId) {
                        selectedNode = Contract;
                        wbsTree.setSelectedNode(selectedNode);
                        d = selectedNode;
                    }
                } else if (type == "Program") {
                    SelectedProgramId = $(this).attr('ProgramId');
                    $.each(Treedata.children, function (i, Contract) {

                        if (Contract.ProgramID == SelectedProgramId) {
                            selectedNode = Contract;
                            wbsTree.setSelectedNode(selectedNode);
                            d = selectedNode;
                        }

                    });
                } else if (type == "ProgramElement") {
                    SelectedProgramElementId = $(this).attr('ProgramElementId');
                    $.each(Treedata.children, function (i, Contract) {
                        if (Contract.children) {
                            $.each(Contract.children, function (j, Project) {

                                if (Project.ProgramElementID == SelectedProgramElementId) {
                                    selectedNode = Project;
                                    wbsTree.setSelectedNode(selectedNode);
                                    d = selectedNode;
                                }

                            });
                        }
                    });
                } else if (type == "Project") {
                    SelectedProjectId = $(this).attr('ProjectId');
                    $.each(Treedata.children, function (i, Contract) {
                        if (Contract.children) {
                            $.each(Contract.children, function (j, Project) {
                                if (Project.children) {
                                    $.each(Project.children, function (k, Element) {

                                        if (Element.ProjectID == SelectedProjectId) {
                                            selectedNode = Element;
                                            wbsTree.setSelectedNode(selectedNode);
                                            d = selectedNode;
                                        }

                                    });
                                }
                            });
                        }
                    });
                }
                wbsTree.click(wbsTree, d);
            })
                .on('contextmenu', function (d, i) {
                    console.log(d);
                    //d3.event.preventDefault();
                    var e = d;
                    type = $(this).attr('level');
                    if (type == "Root") {
                        SelectedOrganizationId = $(this).attr('OrganizationId');
                        if (Treedata.organizationID == SelectedOrganizationId) {
                            selectedNode = Treedata;
                            wbsTree.setSelectedNode(selectedNode);
                            d = selectedNode;
                        }
                    } else if (type == "Program") {
                        SelectedProgramId = $(this).attr('ProgramId');
                        $.each(Treedata.children, function (i, Contract) {

                            if (Contract.ProgramID == SelectedProgramId) {
                                selectedNode = Contract;
                                wbsTree.setSelectedNode(selectedNode);
                                d = selectedNode;
                            }

                        });
                    } else if (type == "ProgramElement") {
                        SelectedProgramElementId = $(this).attr('ProgramElementId');
                        $.each(Treedata.children, function (i, Contract) {
                            if (Contract.children) {
                                $.each(Contract.children, function (j, Project) {

                                    if (Project.ProgramElementID == SelectedProgramElementId) {
                                        selectedNode = Project;
                                        wbsTree.setSelectedNode(selectedNode);
                                        d = selectedNode;
                                    }

                                });
                            }
                        });
                    } else if (type == "Project") {
                        SelectedProjectId = $(this).attr('ProjectId');
                        $.each(Treedata.children, function (i, Contract) {
                            if (Contract.children) {
                                $.each(Contract.children, function (j, Project) {
                                    if (Project.children) {
                                        $.each(Project.children, function (k, Element) {

                                            if (Element.ProjectID == SelectedProjectId) {
                                                selectedNode = Element;
                                                wbsTree.setSelectedNode(selectedNode);
                                                d = selectedNode;
                                            }

                                        });
                                    }
                                });
                            }
                        });
                    }
                    //wbsTree.rightclick(wbsTree, d);
                    displayMenu(type, e, d);
                })
                .on('dblclick', function (d, i) { // swapnil 28/12/2020
                    //d3.event.preventDefault();
                    type = $(this).attr('level');
                    if (type == "Root") {
                        SelectedOrganizationId = $(this).attr('OrganizationId');
                        if (Treedata.organizationID == SelectedOrganizationId) {
                            selectedNode = Treedata;
                            wbsTree.setSelectedNode(selectedNode);
                            d = selectedNode;
                        }
                    } else if (type == "Program") {
                        SelectedProgramId = $(this).attr('ProgramId');
                        $.each(Treedata.children, function (i, Contract) {

                            if (Contract.ProgramID == SelectedProgramId) {
                                selectedNode = Contract;
                                wbsTree.setSelectedNode(selectedNode);
                                d = selectedNode;
                            }

                        });
                    } else if (type == "ProgramElement") {
                        SelectedProgramElementId = $(this).attr('ProgramElementId');
                        $.each(Treedata.children, function (i, Contract) {
                            if (Contract.children) {
                                $.each(Contract.children, function (j, Project) {

                                    if (Project.ProgramElementID == SelectedProgramElementId) {
                                        selectedNode = Project;
                                        wbsTree.setSelectedNode(selectedNode);
                                        d = selectedNode;
                                    }

                                });
                            }
                        });
                    } else if (type == "Project") {
                        SelectedProjectId = $(this).attr('ProjectId');
                        $.each(Treedata.children, function (i, Contract) {
                            if (Contract.children) {
                                $.each(Contract.children, function (j, Project) {
                                    if (Project.children) {
                                        $.each(Project.children, function (k, Element) {

                                            if (Element.ProjectID == SelectedProjectId) {
                                                selectedNode = Element;
                                                wbsTree.setSelectedNode(selectedNode);
                                                d = selectedNode;
                                            }

                                        });
                                    }
                                });
                            }
                        });
                    }
                    wbsTree.dblclick(wbsTree, d);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                //.call(dragListener)
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                //.on('dblclick', click)
                .on('click', function (d) {
                    console.debug(d);
                    wbsTree.click(wbsTree, d);
                })
                .on('contextmenu', function (d, i) {
                    d3.event.preventDefault();
                    wbsTree.rightclick(wbsTree, d);
                }).on('dblclick', function (d, i) { // swapnil 28/12/2020
                    d3.event.preventDefault();
                    wbsTree.dblclick(wbsTree, d);
                });


            nodeEnter.append("image")
                .attr("xlink:href", function (d) {
                    if (d.level == "Root")
                        return "assets/js/wbs-tree/images/nodeA.png";
                    if (d.level == "Program")
                        return "assets/js/wbs-tree/images/nodeB.png";
                    if (d.level == "ProgramElement")
                        return "assets/js/wbs-tree/images/nodeE.png";
                    if (d.level == "Project" && d.TotalUnapprovedTrends == "0")
                        return "assets/js/wbs-tree/images/nodeD.png";
                    else
                        return "assets/js/wbs-tree/images/nodeC.png";
                })
                .attr("x", "-5px")
                .attr("y", "-5px")
                .attr("width", "15px")
                .attr("height", "15px");



            var textx = nodeEnter.append("text")
                .attr("x", function (d) {
                    //return d.children || d._children ? -10 : 10;
                    var nodeTextXOffset = 0;
                    if (d.level == "Program" || d.level == "ProgramElement") {
                        nodeTextXOffset = -50
                    }
                    return nodeTextXOffset;
                })
                .attr("y", -15)
                .attr("dy", "0.35em")
                .attr('class', 'nodeText')
                .attr("text-anchor", function (d) {
                    //return d.children || d._children ? "end" : "start";
                    return d.level == "Root" ? "end" : "start";
                })
                .text(function (d) {

                    return d.name;
                })
                .style("fill-opacity", 1);

            //break word label if too long
            //wrap(textx, lineWidth);


            console.debug("MONEY", "MONEY");
            nodeEnter.append("text")
                .attr("x", function (d) {
                    //return d.children || d._children ? -10 : 10;
                    var nodeTextXOffset = 0;
                    if (d.level == "Program" || d.level == "ProgramElement" || d.level == "Project") {
                        nodeTextXOffset = -40
                    } else if (d.level == "Project") {
                        nodeTextXOffset = -40
                    }
                    return nodeTextXOffset;
                })
                .attr("y", 15)
                .attr("dy", "0.35em")
                .attr('class', 'nodeText')
                .attr("text-anchor", function (d) {
                    //return d.children || d._children ? "end" : "start";
                    return d.level == "Root" ? "end" : "start";
                })
                .text(function (d) {
                    if (d.level == "Root") {
                    }
                    else {
                        if (d.CurrentCost == null || d.CurrentCost == "" || d.CurrentCost == 0 || isNaN(d.CurrentCost)) {
                            return "";
                        }
                        //return "( $" + d.CurrentCost + " | " + d.CurrentStartDate + ")";
                        //alert();
                        console.debug(d.CurrentCost);
                        return "( $" + addCommas(d.CurrentCost) + " )";
                    }
                })
                .style("fill-opacity", 1);

            // phantom node to give us mouseover in a radius around it
            nodeEnter.append("circle")
                .attr('class', 'ghostCircle')
                .attr("r", 30)
                .attr("opacity", 0.2) // change this to zero to hide the target area
                .style("fill", "red")
                .attr('pointer-events', 'mouseover')
                .on("mouseover", function (node) {
                    overCircle(node);
                })
                .on("mouseout", function (node) {
                    outCircle(node);
                });


            // Update the text to reflect whether node has children or not.
            console.log(node.select('text:nth-child(3)'));
            var s = node.select('text:nth-child(2)')
                .attr("x", function (d) {
                    //return d.children || d._children ? -10 : 10;
                    var nodeTextXOffset = 0;
                    if (d.level == "Program" || d.level == "ProgramElement") {
                        nodeTextXOffset = -40
                    } else if (d.level == "Project") {
                        nodeTextXOffset = -40
                    }
                    else if (d.level == "Root") {
                        nodeTextXOffset = -80
                    }
                    return nodeTextXOffset;
                })

                .attr("text-anchor", function (d) {
                    //return d.children || d._children ? "end" : "start";
                    //return d.level == "Root" ? "end" : "start";
                    return "start";
                }).text(function (d) {
                    return d.name;
                });

            //break word label if too long on node update
            wrap(s, lineWidth);


            node.select('text:nth-child(3)')
                .attr("x", function (d) {
                    //return d.children || d._children ? -10 : 10;
                    var nodeTextXOffset = 0;
                    if (d.level == "Program" || d.level == "ProgramElement") {
                        nodeTextXOffset = -40
                    } else if (d.level == "Project") {
                        nodeTextXOffset = -40
                    }
                    else if (d.level == "Root") {
                        nodeTextXOffset = -80
                    }
                    return nodeTextXOffset;
                })

                .attr("text-anchor", function (d) {
                    //return d.children || d._children ? "end" : "start";
                    //return d.level == "Root" ? "end" : "start";
                    return "start";
                })
                .text(function (d) {
                    if (d.level == "Root") {
                    }
                    else {
                        if (d.CurrentCost == null || d.CurrentCost == "" || d.CurrentCost == 0 || isNaN(d.CurrentCost)) {
                            return "";
                        }
                        //return "( $" + d.CurrentCost + " | " + d.CurrentStartDate + ")";
                        //alert();
                        return "( $" + addCommas(d.CurrentCost) + " )";
                    }
                });

            //node.select('text').text(function(d){
            //   return d.CurrentCost;
            //});
            // Change the circle fill depending on whether it has children and is collapsed
            node.select("circle.nodeCircle")
                .attr("r", 4.5)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(_duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Fade the text in
            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(_duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 0);

            nodeExit.select("text")
                .style("fill-opacity", 0);

            // Update the links…
            var link = _svgGroup.selectAll("path.link")
                .data(links, function (d) {
                    if (d.target.level == "PastTrend" || d.target.level == "CurrentTrend" || d.target.level == "FutureTrend") {
                    }
                    else
                        return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

            // Transition links to their new position.
            link.transition()
                .duration(_duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(_duration)
                .attr("d", function (d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();


            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        function wrap(text, lineWidth) {

            text.each(function (d) {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy"));


                if (d.level == "Root") {
                    var tspan = text.text(null).append("tspan").attr("x", -80).attr("y", y).attr("dy", dy + "em");
                    width = lineWidth - 100;
                }
                else {
                    var tspan = text.text(null).append("tspan").attr("x", -40).attr("y", y).attr("dy", dy + "em");
                    width = lineWidth - 50;
                }

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > (width)) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];

                        if (d.level == "Root")
                            tspan = text.append("tspan").attr("x", -80).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        else
                            tspan = text.append("tspan").attr("x", -40).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        // this.append(tspan);
                    }
                }
                var t = (text[0]);
                var node = $($(t).get(0)).children();
                var count = node.length - 1;

                $.each(node, function (item) {
                    console.log(count);
                    var x = parseFloat(y) - (count * 15);
                    x = x.toString();
                    $(this).attr("y", x);

                })
            });
        }

        obj.prototype.click = function (wbsTree, d) {
            console.log(d);
            wbsTree.setSelectedNode(d);
            // alert(d.level);
            if (d.level == "Root" || d.level == "Program" || d.level == "ProgramElement") {
                d = toggleChildren(d);
                wbsTree.updateTreeNodes(d);
            }
            else if (d.level == "Project") {
                //Of couse, how to access selectProjectDataDash from here
                //var proj = myLocalStorage.get('selectProjectDataDash');
                var projProjectManagerID = localStorage.getItem('selectProjectProjectManagerIDDash');
                var projDirectorID = localStorage.getItem('selectProjectDirectorIDDash');
                var projSchedulerID = localStorage.getItem('selectProjectSchedulerIDDash');
                var projVicePresidentID = localStorage.getItem('selectProjectVicePresidentIDDash');
                var projFinancialAnalystID = localStorage.getItem('selectProjectFinancialAnalystIDDash');
                var projtCapitalProjectAssistantID = localStorage.getItem('selectProjectCapitalProjectAssistantIDDash');

                var parent = this.getSelectedNode().parent;
                var self = this.getSelectedNode();

                console.log(this.getSelectedNode());
                console.log(parent);

                //luan whitelist permission
                wbsTree.getProjectWhiteListService().get({}, function (response) {
                    console.log(response);
                    var isWhiteListed = false;
                    var wholeProjectWhiteList = response.result;

                    //// Pritesh  validate Activity added on 4 Aug  2020
                    if (wbsTree.getLocalStorage().acl[8] == 0 && wbsTree.getLocalStorage().acl[9] == 0) {
                        dhtmlx.alert('You do not have access to view Activity.');
                        return false;
                    }
                    // console.log(wbsTree.getLocalStorage());
                    console.log(wholeProjectWhiteList);

                    for (var x = 0; x < wholeProjectWhiteList.length; x++) {
                        if (wholeProjectWhiteList[x].ProjectID == self.ProjectID && wholeProjectWhiteList[x].EmployeeID == wbsTree.getLocalStorage().employeeID) {
                            isWhiteListed = true;
                        }
                    }

                    if (!isWhiteListed) {
                        var noAccessMsg = '';
                        switch (wbsTree.getLocalStorage().role) {
                            case 'Admin':
                            case 'Accounting':
                                break;
                            case 'Project Manager':
                                if (wbsTree.getLocalStorage().employeeID != parent.ProjectManagerID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Director':
                                if (wbsTree.getLocalStorage().employeeID != parent.DirectorID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Program Manager':
                                if (wbsTree.getLocalStorage().employeeID != parent.ProgramManagerID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Financial Analyst':
                                if (wbsTree.getLocalStorage().employeeID != parent.FinancialAnalystID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Vice President':
                                if (wbsTree.getLocalStorage().employeeID != parent.VicePresidentID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Scheduler':
                                if (wbsTree.getLocalStorage().employeeID != parent.SchedulerID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Capital Project Assistant':
                                if (wbsTree.getLocalStorage().employeeID != parent.CapitalProjectAssistantID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            default:
                                noAccessMsg = 'You are not assigned to this Project Element.';
                        }

                    }
                    var scope = wbsTree.getScope();

                    // scope.trendSpinner = true;
                    //$('#trendSvg').attr('class','svg-spin');
                    //   $('#trendSvg').classList.add('svg-spin');
                    var trendSvg = document.getElementById("trendSvg");
                    trendSvg.classList.add('svg-spin');
                    $('#spinTrend').addClass('fademe');

                    console.log($('#trendSvg'));
                    var selectedProjectID = d.ProjectID;
                    wbsTree.setSelectedProjectID(selectedProjectID);
                    var projectNameElement = $("#project_name");
                    projectNameElement.html(d.name);
                    projectNameElement.html(d.name);
                    //projectNameElement.show();
                    /*---Start Add by shank ---- */
                    localStorage.setItem('selectProjectIdDash', selectedProjectID);
                    localStorage.setItem('selectProjectNameDash', d.name);

                    // For App Sec
                    localStorage.setItem('selectProjectDataDash', d);

                    localStorage.setItem('selectProjectProjectManagerIDDash', parent.ProjectManagerID);
                    localStorage.setItem('selectProjectDirectorIDDash', parent.DirectorID);
                    localStorage.setItem('selectProjectSchedulerIDDash', parent.SchedulerID);
                    localStorage.setItem('selectProjectVicePresidentIDDash', parent.VicePresidentID);
                    localStorage.setItem('selectProjectFinancialAnalystIDDash', parent.FinancialAnalystID);
                    localStorage.setItem('selectProjectCapitalProjectAssistantIDDash', parent.CapitalProjectAssistantID);

                    /* ---- End  ----- */
                    wbsTree.getWBSTrendTree().setProjectName(d.name);
                    wbsTree.getWBSTrendTree().trendGraph(true);
                    wbsTree.getProjectMap().initProjectMap(wbsTree.getSelectedNode(), wbsTree.getOrganizationList());
                    //$('#trendSvg').removeAttr('class','svg-spin');
                    trendSvg.classList.remove('svg-spin');
                    // scope.trendSpinner = false;
                });
            }
            $("#contextMenu").hide();
        }

        //var panelToggle;
        obj.prototype.rightclick = function (wbsTree, d) {
            console.log(d);
            wbsTree.setSelectedNode(d);
            if (d.level == "Root") {
                //$('#RootModal').modal('show');
                console.log('opening root menu');
                wbsTree.showContextMenu(d, d.level);
                wbsTree.getFundType().getFundTypeByOrgID().get({ OrganizationID: $("#selectOrg").val() }, function (response) {
                    wbsTree.setFundTypeList(response.result);
                });
                //getPhaseCode
                wbsTree.getPhaseCode().get({}, function (response) {
                    var all = {
                        ActivityPhaseCode: 6,
                        Code: "ALL",
                        PhaseDescription: "ALL",
                        PhaseID: 6
                    }
                    response.result.splice(0, 0, all);
                    console.log(response.result);
                    wbsTree.setPhaseCodeList(response.result);
                })
                //set BudgetCategories
                //wbsTree.getMainCategory().get({Phase:'All'},function(response){
                //    wbsTree.setMainCategoryList(response.result);
                //});
                //wbsTree.getProgramCategory().getMainActivityCategoryProgram().get({ Phase: 'All' }, function (response) {
                //    wbsTree.setMainCategoryList(response.result);
                //});
                wbsTree.setFundToBeAdded([]);
                wbsTree.setFundToBeDeleted([]);
                wbsTree.setCategoryToBeAdded([]);
                wbsTree.setCategoryToBeDeleted([]);
                _IsRootForModification = true; // Jignesh 23-11-2020
            }

            else if (d.level == "Program") {
                //$('#ProgramModal').modal('show');
                wbsTree.getFundType().getFundTypeByOrgID().get({ OrganizationID: $("#selectOrg").val() }, function (response) {
                    wbsTree.setFundTypeList(response.result);
                });
                //getPhaseCode
                wbsTree.getPhaseCode().get({}, function (response) {
                    var all = {
                        ActivityPhaseCode: 6,
                        Code: "ALL",
                        PhaseDescription: "ALL",
                        PhaseID: 6
                    }
                    response.result.splice(0, 0, all);
                    console.log(response.result);
                    wbsTree.setPhaseCodeList(response.result);
                })
                //set BudgetCategories
                var wbstree = wbsTree.getProgramCategory();
                console.log(wbstree);

                //Amruta -- Populate client dropdown for new contract
                console.log("Client dd=====>");
                modal = $(this);
                var clientDropDown = modal.find('.modal-body #program_client_poc');
                var clientList = wbsTree.getClientList();
                clientDropDown.empty();

                for (var x = 0; x < clientList.length; x++) {
                    if (clientList[x].ClientName == null) {
                        continue;
                    }
                    clientDropDown.append('<option selected="false">' + clientList[x].ClientName + '</option>');
                    clientDropDown.val('');
                }
                /* var clientList = wbsTree.getClientList();
             var selectedClient = $('#ProgramModal').find('.modal-body #program_client_poc');
                 console.log(selectedClient, selectedClient.val());
                 d.ClientID = 0;
                 for (var x = 0; x < clientList.length; x++) {
                     console.log(clientList[x].ClientName, selectedClient.val());
                     if (clientList[x].ClientName == selectedClient.val()) {
                         d.ClientID = clientList[x].ClientID;
                     }
                 }*/
                //wbsTree.getProgramCategory().getMainActivityCategoryProgram().get({ Phase: 'All' }, function (response) {
                //    wbsTree.setMainCategoryList(response.result);
                //});
                //wbsTree.getMainCategory().get({Phase:'All'},function(response){
                //    wbsTree.setMainCategoryList(response.result);
                //});
                console.log('opening program menu');
                var orgProgramFund = jQuery.extend(true, [], d.programFunds);
                var orgProgramCategory = jQuery.extend(true, [], d.programCategories);
                wbsTree.setFundToBeAdded(d.programFunds);
                wbsTree.setFundToBeDeleted([]);
                wbsTree.setCategoryToBeAdded(d.programCategories);
                wbsTree.setCategoryToBeDeleted([]);
                wbsTree.setOrgProgramFund(orgProgramFund);
                wbsTree.setOrgProgramCategory(orgProgramCategory);
                wbsTree.showContextMenu(d, d.level);
                wbsTree.setSelectedProgramID(d.ProgramID);
                _IsRootForModification = false;// Jignesh 23-11-2020
            }

            else if (d.level == "ProgramElement") {
                //$('#ProgramElementModal').modal('show');
                console.log('opening program element menu');
                wbsTree.showContextMenu(d, d.level);
                wbsTree.setSelectedProgramID(d.ProgramID);
                wbsTree.setSelectedProgramElementID(d.ProgramElementID);

                wbsTree.setScopeToBeAdded([]);
                wbsTree.setScopeToBeDeleted([]);
            }

            else if (d.level == "Project") {
                //$('#p').modal('show');
                //selectedProjectID = d.ProjectID;
                //trendGraph();
                //trendSpinner

                var parent = this.getSelectedNode().parent;
                var self = this.getSelectedNode();

                console.log(this.getSelectedNode());
                console.log(parent);

                //luan whitelist permission
                wbsTree.getProjectWhiteListService().get({}, function (response) {
                    console.log(response);
                    var isWhiteListed = false;
                    var wholeProjectWhiteList = response.result;

                    console.log(wholeProjectWhiteList);

                    for (var x = 0; x < wholeProjectWhiteList.length; x++) {
                        if (wholeProjectWhiteList[x].ProjectID == self.ProjectID && wholeProjectWhiteList[x].EmployeeID == wbsTree.getLocalStorage().employeeID) {
                            isWhiteListed = true;
                        }
                    }

                    if (!isWhiteListed) {
                        var noAccessMsg = '';
                        switch (wbsTree.getLocalStorage().role) {
                            case 'Admin':
                            case 'Accounting':
                                break;
                            case 'Project Manager':
                                if (wbsTree.getLocalStorage().employeeID != d.ProjectManagerID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Director':
                                if (wbsTree.getLocalStorage().employeeID != d.DirectorID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Program Manager':
                                if (wbsTree.getLocalStorage().employeeID != d.ProgramManagerID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Financial Analyst':
                                if (wbsTree.getLocalStorage().employeeID != d.FinancialAnalystID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Vice President':
                                if (wbsTree.getLocalStorage().employeeID != d.VicePresidentID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Scheduler':
                                if (wbsTree.getLocalStorage().employeeID != d.SchedulerID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            case 'Capital Project Assistant':
                                if (wbsTree.getLocalStorage().employeeID != d.CapitalProjectAssistantID) {
                                    noAccessMsg = 'You are not assigned to this Project.';
                                }
                                break;
                            default:
                                noAccessMsg = 'You are not assigned to this Project.';
                        }
                        //if (noAccessMsg != '') {
                        //    //dhtmlx.alert('Role:' + wbsTree.getLocalStorage().role + ' employeeID:' + wbsTree.getLocalStorage().employeeID);
                        //    //wbsTreeNode.trendGraphNoProject();
                        //    dhtmlx.alert(noAccessMsg);
                        //    return;
                        //}
                    }
                    var ss = wbsTree.getWBSTrendTree().getSelectedTreeNode();
                    //wbsTree.setNewTrend(true);
                    //var s = wbsTree.getWBSTrendTree().getTrendNumber();
                    //console.log(s);
                    $("#availableFund").html('$' + d.FundTotal);
                    $('#usedFund').html('$' + d.FundUsed);
                    $("#remainingFund").html('$' + d.FundRemained);
                    var trend = wbsTree.getScope().trend;
                    console.log('opening project menu');
                    modal_mode = "Create";
                    wbsTree.showContextMenu(d, d.level);

                    //to open up trend tree on right click
                    wbsTree.setSelectedProjectID(d.ProjectID);
                    wbsTree.setSelectedProgramElementID(d.ProgramElementID);

                    //project scope
                    wbsTree.setScopeToBeAdded(d.projectScopes);
                    wbsTree.setScopeToBeDeleted([]);
                    wbsTree.setOrgProjectName(d.name);
                    wbsTree.getWBSTrendTree().setProjectName(d.name);
                    var projectNameElement = $("#project_name");
                    projectNameElement.html(d.name);
                    projectNameElement.show();

                    //       wbsTree.
                    wbsTree.getProjectMap().initProjectMap(wbsTree.getSelectedNode(), wbsTree.getOrganizationList());
                    wbsTree.getWBSTrendTree().trendGraph(true);
                });
            }
        }

        obj.prototype.dblclick = function (wbsTree, d) {
            console.log(d);
            wbsTree.setSelectedNode(d);
            if (d.level == "Project") {
                window.location.href = "#/app/cost-gantt/" + d.ProjectID + "/1000/" + $("#selectOrg").val();
            }
        }

        obj.prototype.bindEventsForWBSNodes = function () {

            wbsTree = this;

            //DELETE NODE FUNCTION
            $('#delete_button').unbind('click').on('click', function () {
                var selectedNode = wbsTree.getSelectedNode();
                var type = $("#contextMenu").attr('contextType');
                //if(selectedNode.level === "Root"){ Ivan here
                //    modal_mode = "Update";
                //}
                // business logic...
                $('#DeleteModal').modal('hide');
                if (typeof modal_mode == 'undefined') {
                }
                if (type === "ProjectScope") {
                    $('#DeleteModal').appendTo("body");
                    var scopeToBeDeleted = [];
                    scopeToBeDeleted = wbsTree.getScopeToBeDeleted();
                    var scopeTable = $("#scopeTable").find('.scope');
                    // var index ;
                    var rows = $(scopeTable).find('tr');
                    $.each(rows, function () {

                        var rowData = $(this).find('td');
                        var index = $(this).closest('tr').prevAll().length; selectedNode
                        var obj = {};
                        obj.Area = $($(rowData[1]).find('#dropLabel')).text();
                        obj.Description = $($(rowData[2]).find('textarea')).val();
                        obj.ProjectID = selectedNode.ProjectID;
                        obj.isNew = $(rowData[3]).text();
                        obj.Id = $(rowData[4]).text();
                        //obj.description
                        scopeToBeDeleted.push(obj);
                        $(this).remove();
                    });
                    wbsTree.setScopeToBeDeleted(scopeToBeDeleted);
                    if ($('#ProjectScopeModal').hasClass('in'))
                        $('#ProjectScopeModal').css({ "opacity": "1" });
                    $('#scopeTable .scope tbody').empty();
                    return;
                }
                if (modal_mode == 'Create') {

                    if (selectedNode.level === "Root") {
                        // $('#ProgramModal').css({"opacity": "1"}).modal('toggle');
                        $('#ProgramModal').css({ "opacity": "1" }).modal('hide'); //Ivan here
                    }
                    else if (selectedNode.level === "Program") {
                        $("#ProgramElementModal").css({ "opacity": "1" }).modal('hide'); //Ivan here
                    }
                    else if (selectedNode.level === "ProgramElement") {
                        $('#ProjectModal').css({ "opacity": "1" }).modal('hide'); //Ivan here
                    }
                    else if (selectedNode.level === "Project") {
                        $('#FutureTrendModal').css({ "opacity": "1" }).modal('hide'); //Ivan here
                        $('#confirmation_message').html('Are you sure you want to delete this trend? All information will be lost');
                        // $('#ProjectModal').css({"opacity": "1"}).modal('toggle');
                    }
                }

                else {
                    var parentNode = selectedNode.parent;

                    //

                    $('#DeleteModal').appendTo("body");
                    if (wbsTree.getScope().trend) {
                        console.log(wbsTree.getScope().trend);
                        console.log(selectedNode);
                        if (wbsTree.getScope().trend.metadata.level = "FutureTrend") {
                            var obj = {
                                "Operation": 3,
                                "OrganizationID": wbsTree.getScope().trend.metadata.OrganizationID,
                                "ProjectID": wbsTree.getScope().trend.metadata.ProjectID,
                                "ProjectName": wbsTree.getScope().trend.metadata.ProjectName,
                                "TrendNumber": wbsTree.getScope().trend.metadata.TrendNumber

                            };
                            _Trend.persist().save(obj, function (response) {
                                //$('#FutureTrendModal').modal('hide');
                                //$('#DeleteModal').modal('hide');

                                wbsTree.getProgramFund().lookup().get({ "ProgramID": selectedNode.parent.parent.ProgramID }, function (response) {
                                    selectedNode.parent.parent.programFunds = response.result;
                                    if ($('#FutureTrendModal').hasClass('in'))
                                        $('#FutureTrendModal').css({ "opacity": "1" }).modal('toggle');
                                    wbsTree.getWBSTrendTree().setSelectedTreeNode(null);
                                    wbsTree.getWBSTrendTree().trendGraph(true);  //Manasi
                                    wbsTree.getScope().trend = null;


                                });


                            });

                            updateTreeNodes(parentNode);
                        }
                    }
                    else {
                        if (selectedNode.level === "Root") {
                            console.log(selectedNode);
                            var s = $("#update_organization");
                            console.debug("UPDATE", s);
                            var rootScope = wbsTree.getRootScope();
                            var Organization = wbsTree.getOrganizationService();
                            var scope = wbsTree.getScope();
                            Organization.persist().save({
                                "Operation": 3,
                                "OrganizationID": selectedNode.organizationID,
                                "OrganizationName": selectedNode.name
                            }).$promise.then(function (response) {
                                if (response.result === 'Success') {
                                    //  $scope.organizationList.splice(index,1);

                                    console.log(scope);
                                    var orgList = wbsTree.getOrganizationList();
                                    var index = 0;
                                    for (var i = 0; i < orgList.length; i++) {
                                        if (orgList[i].OrganizationName == selectedNode.name) {
                                            index = i;

                                        }
                                    }
                                    console.debug("orgList", orgList);
                                    orgList.splice(index, 1);
                                    // wbsTree.setOrganizationList(orgList);
                                    //  $("#selectOrg").val(orgList[0].OrganizationID);
                                    console.debug("orgList", orgList);
                                    scope.filterOrg = orgList[0].OrganizationID;
                                    $("#selectOrg").val(orgList[0].OrganizationID);
                                    scope.filterChangeOrg();
                                    //$scope.selectedOrg = null;
                                    //$scope.init();
                                    //console.log("-------DELETED ORGANIZATION--------");
                                    //wbsTree.updateTreeNodes(selectedNode);
                                    rootScope.modalInstance.close();
                                    //wbsTree.getWBSTrendTree().trendGraph();
                                }
                                else {
                                    dhtmlx.alert("Delete failed");
                                }
                            });


                        } else
                            if (selectedNode.level === "Program") {
                                wbsTree.getProgram().persist().save({
                                    "Operation": 3,
                                    "ProgramID": selectedNode.ProgramID,
                                    "ProgramName": selectedNode.name,
                                    "ProgramManager": selectedNode.ProgramManager,
                                    "ProgramSponsor": selectedNode.ProgramSponsor,
                                    "programFunds": selectedNode.programFunds

                                }, function (response) {
                                    console.log("-------DELETED PROGRAM--------");
                                    if ($('#ProgramModal').hasClass('in'))
                                        $('#ProgramModal').css({ "opacity": "1" }).modal('toggle');
                                    wbsTree.updateTreeNodes(selectedNode.parent);

                                    wbsTree.getWBSTrendTree().trendGraph();
                                    //window.location.reload();   //Manasi 28-07-2020
                                });
                            } else if (selectedNode.level === "ProgramElement") {
                                wbsTree.getProgramElement().persist().save({
                                    "Operation": 3,
                                    "ProgramID": selectedNode.ProgramID,
                                    "ProgramElementID": selectedNode.ProgramElementID,
                                    "ProgramElementName": selectedNode.name,
                                    "ProgramElementManager": selectedNode.ProgramElementManager,
                                    "ProgramElementSponsor": selectedNode.ProgramElementSponsor

                                }, function (response) {
                                    console.log("-------DELETED PROGRAM ELEMENT--------");

                                    wbsTree.getProgramFund().lookup().get({ "ProgramID": selectedNode.parent.ProgramID }, function (response) {
                                        console.log(response);
                                        selectedNode.parent.programFunds = response.result;
                                        var programElementList = selectedNode.parent.children;
                                        var total = 0;
                                        angular.forEach(programElementList, function (item) {
                                            total += parseFloat(item.CurrentCost);
                                        });

                                        selectedNode.parent.CurrentCost = total.toString();
                                        wbsTree.updateTreeNodes(selectedNode.parent);
                                        if ($('#ProjectModal').hasClass('in'))
                                            $('#ProjectModal').css({ "opacity": "1" }).modal('toggle');
                                        wbsTree.getWBSTrendTree().trendGraph();

                                        //window.location.reload();   //Manasi 28-07-2020
                                    });
                                    if ($('#ProgramElementModal').hasClass('in'))
                                        $("#ProgramElementModal").css({ "opacity": "1" }).modal('toggle');
                                    wbsTree.getWBSTrendTree().trendGraph();

                                })
                            } else if (selectedNode.level === "Project" && !wbsTree.getScope().trend) {
                                wbsTree.getProject().persist().save({
                                    "Operation": 3,
                                    "ProjectID": selectedNode.ProjectID,
                                    "ProjectName": selectedNode.name,
                                    "ProjectManager": selectedNode.ProjectManager,
                                    "ProjectSponsor": selectedNode.ProjectSponsor,
                                    "LatLong": wbsTree.getProjectMap().getCoordinates()
                                }, function (response) {
                                    console.log("-------DELETED PROJECT--------");
                                    console.log(selectedNode);
                                    wbsTree.getProgramFund().lookup().get({ "ProgramID": selectedNode.parent.parent.ProgramID }, function (response) {
                                        console.log(response);
                                        var projectList = selectedNode.parent.children;
                                        var programElementList = selectedNode.parent.parent.children;
                                        var total = 0;
                                        angular.forEach(projectList, function (item) {
                                            console.log(item);
                                            if (item.CurrentCost)
                                                total += parseFloat(item.CurrentCost);
                                        });
                                        console.debug("Total1", total);
                                        selectedNode.parent.CurrentCost = total.toString();
                                        total = 0;
                                        angular.forEach(programElementList, function (item) {
                                            if (item.CurrentCost)
                                                total += parseFloat(item.CurrentCost);
                                        });
                                        console.debug("Total2", total);
                                        selectedNode.parent.parent.CurrentCost = total.toString();


                                        selectedNode.parent.parent.programFunds = response.result;
                                        wbsTree.updateTreeNodes(selectedNode.parent);

                                        if ($('#ProjectModal').hasClass('in'))
                                            $('#ProjectModal').css({ "opacity": "1" }).modal('toggle');

                                        wbsTree.getWBSTrendTree().trendGraph();
                                        console.log(wbsTree.getWBSTrendTree().getTrendNumber());
                                        //set the project location to organization's locaion on delete project
                                        selectedNode.LatLong = "";
                                        wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());

                                        //window.location.reload();   //Manasi 28-07-2020
                                    });

                                });
                            }
                        //Find  index of selected node
                        if (selectedNode.level == "Root") return;
                        var i = parentNode.children.indexOf(selectedNode);
                        //Remove selected child index from parent
                        parentNode.children.splice(i, 1);
                        var tooltip = d3.select("#toolTip").style("opacity", 0);

                    }
                }
                _selectedProjectID = null;
                //$('#project_name').hide();
                $('svg.trendTree g').hide();

            });

            function populateContractTable(programID) {

                wbsTree.getContract().get({}, function (contractData) {

                    wbsTree.getProgramContract().get({}, function (programContractData) {
                        var programContractList = programContractData.result;
                        var contractList = contractData.result;
                        wbsTree.setProgramContractList(programContractList);
                        wbsTree.setContractList(contractList);

                        $('#program_contract_table_body_id').empty();

                        for (var x = 0; x < programContractList.length; x++) {
                            console.log(programContractList[x].ProgramID, programID);

                            if (programContractList[x].ProgramID == programID) {
                                var singleContract = {};

                                for (var y = 0; y < contractList.length; y++) {
                                    if (programContractList[x].ContractID == contractList[y].ContractID) {
                                        singleContract = contractList[y];
                                    }
                                }


                                //luan here - Find the program project class name
                                var projectClassName = "";
                                var projectClassList = wbsTree.getProjectClassList();
                                for (var y = 0; y < projectClassList.length; y++) {
                                    if (projectClassList[y].ProjectClassID == singleContract.ProjectClassID) {
                                        projectClassName = projectClassList[y].ProjectClassName;
                                    }
                                }

                                console.log(singleContract);

                                $('#program_contract_table_body_id').append(
                                    '<tr id="' + singleContract.ContractID + '" class="fade-selection-animation clickable-row">' +
                                    '<td class="class-td-LiveView" style="width:17.5%;">' + singleContract.ContractNumber + '</td>' +
                                    '<td class="class-td-LiveView" style="width:30%;">' + singleContract.ContractName + '</td>' +
                                    '<td class="class-td-LiveView" style="width:17.5%;">' + singleContract.ContractStartDate + '</td>' +
                                    '<td class="class-td-LiveView" style="width:17.5%;">' + singleContract.ContractEndDate + '</td>' +
                                    '<td class="class-td-LiveView" style="width:17.5%;">' + projectClassName + '</td>' +
                                    '</tr>'
                                );
                            }
                        }
                    });

                });
            }

            function populateContractTableNew() {
                $('#program_contract_table_body_id').empty();

                for (var x = 0; x < g_contract_draft_list.length; x++) {
                    var singleContract = {};

                    singleContract = g_contract_draft_list[x];

                    //luan here - Find the program project class name
                    var projectClassName = "";
                    var projectClassList = wbsTree.getProjectClassList();
                    for (var y = 0; y < projectClassList.length; y++) {
                        if (projectClassList[y].ProjectClassID == singleContract.ProjectClassID) {
                            projectClassName = projectClassList[y].ProjectClassName;
                        }
                    }

                    console.log(singleContract);

                    $('#program_contract_table_body_id').append(
                        '<tr id="' + singleContract.ContractNumber + '" class="fade-selection-animation clickable-row">' +
                        '<td class="class-td-LiveView" style="width:17.5%;">' + singleContract.ContractNumber + '</td>' +
                        '<td class="class-td-LiveView" style="width:30%;">' + singleContract.ContractName + '</td>' +
                        '<td class="class-td-LiveView" style="width:17.5%;">' + singleContract.ContractStartDate + '</td>' +
                        '<td class="class-td-LiveView" style="width:17.5%;">' + singleContract.ContractEndDate + '</td>' +
                        '<td class="class-td-LiveView" style="width:17.5%;">' + projectClassName + '</td>' +
                        '</tr>'
                    );
                }
            }

            //Project element milestone
            function populateProjectElementMilestoneTable(projectID) {

                wbsTree.getMilestone().get({}, function (milestoneData) {
                    var milestoneList = milestoneData.result;
                    wbsTree.setMilestoneList(milestoneList);

                    $('#project_element_milestone_table_id').empty();

                    for (var x = 0; x < milestoneList.length; x++) {
                        console.log(milestoneList[x].ProjectID, projectID);

                        if (milestoneList[x].ProjectID == projectID) {
                            var singeMilestone = {};
                            singeMilestone = milestoneList[x];

                            console.log(singeMilestone);

                            $('#project_element_milestone_table_id').append(
                                '<tr id="' + singeMilestone.MilestoneID + '" class="fade-selection-animation clickable-row">' +
                                '<td style="width: 28px">' +
                                '<input id=rbCo' + singeMilestone.MilestoneID + ' type="radio" name="rbmilestone" value="' + serviceBasePath + 'Request/DocumentByDocID/' + singeMilestone.DocumentID + '" />' +
                                '</td >' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneName + '</td>' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;;">' + singeMilestone.MilestoneDescription + '</td>' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDate + '</td>' +
                                '</tr>'
                            );
                        }
                    }
                });
            }

            //Project element milestone
            function populateProjectElementMilestoneTableNew() {
                $('#project_element_milestone_table_id').empty();

                for (var x = 0; x < g_project_element_milestone_draft_list.length; x++) {
                    var singeMilestone = {};

                    singeMilestone = g_project_element_milestone_draft_list[x];

                    console.log(singeMilestone);

                    $('#project_element_milestone_table_id').append(
                        '<tr id="' + singeMilestone.MilestoneName + '" class="fade-selection-animation clickable-row">' +
                        '<td style="width: 28px">' +
                        '<input id=rbCo' + singeMilestone.MilestoneID + ' type="radio" name="rbmilestone" value="' + serviceBasePath + 'Request/DocumentByDocID/' + singeMilestone.DocumentID + '" />' +
                        '</td >' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneName + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDescription + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDate + '</td>' +
                        '</tr>'
                    );
                }
            }

            //Program element milestone
            function populateProgramElementMilestoneTable(programElementID) {

                wbsTree.getMilestone().get({}, function (milestoneData) {
                    var milestoneList = milestoneData.result;
                    wbsTree.setMilestoneList(milestoneList);

                    $('#program_element_milestone_table_id').empty();

                    for (var x = 0; x < milestoneList.length; x++) {
                        console.log(milestoneList[x].ProgramElementID, programElementID);

                        if (milestoneList[x].ProgramElementID == programElementID) {
                            var singeMilestone = {};
                            singeMilestone = milestoneList[x];

                            console.log(singeMilestone);

                            $('#program_element_milestone_table_id').append(
                                '<tr id="' + singeMilestone.MilestoneID + '" class="fade-selection-animation clickable-row">' +
                                '<td style="width: 28px">' +
                                '<input id=rbCo' + singeMilestone.MilestoneID + ' type="radio" name="rbmilestone" value="' + serviceBasePath + 'Request/DocumentByDocID/' + singeMilestone.DocumentID + '" />' +
                                '</td >' +
                                /*'<tr id="' + singeMilestone.MilestoneID + '" class="fade-selection-animation clickable-row">' +*/
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneName + '</td>' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDescription + '</td>' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDate + '</td>' +
                                '</tr>'
                            );


                        }
                    }
                });
            }

            //Program element milestone
            function populateProgramElementMilestoneTableNew() {
                $('#program_element_milestone_table_id').empty();

                for (var x = 0; x < g_program_element_milestone_draft_list.length; x++) {
                    var singeMilestone = {};

                    singeMilestone = g_program_element_milestone_draft_list[x];

                    console.log(singeMilestone);

                    $('#program_element_milestone_table_id').append(
                        '<tr id="' + singeMilestone.MilestoneName + '" class="fade-selection-animation clickable-row">' +
                        '<td style="width: 28px">' +
                        '<input id=rbCo' + singeMilestone.MilestoneID + ' type="radio" name="rbmilestone" value="' + serviceBasePath + 'Request/DocumentByDocID/' + singeMilestone.DocumentID + '" />' +
                        '</td >' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneName + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDescription + '</td>' +
                        '<td class="class-td-LiveView" style=font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeMilestone.MilestoneDate + '</td>' +
                        '</tr>'
                    );
                }
            }

            //Program element change order
            function populateProgramElementChangeOrderTable(programElementID) {

                $('#downloadBtnChangeOrder').attr('disabled', 'disabled');
                $('#ViewUploadFileChangeOrder').attr('disabled', 'disabled');
                $('#edit_program_element_change_order').attr('disabled', 'disabled');
                wbsTree.getChangeOrder().get({}, function (changeOrderData) {
                    var changeOrderList = changeOrderData.result;
                    wbsTree.setChangeOrderList(changeOrderList);
                    $('#program_element_change_order_table_id').empty();
                    //  setInterval(function () {
                    //alert(singeChangeOrder.DocumentName);

                    for (var x = 0; x < changeOrderList.length; x++) {
                        console.log(changeOrderList[x].ProgramElementID, programElementID);

                        if (changeOrderList[x].ProgramElementID == programElementID) {


                            var singeChangeOrder = {};
                            singeChangeOrder = changeOrderList[x];

                            // alert(singeChangeOrder.DocumentName);
                            console.log(singeChangeOrder);

                            // Jignesh-ChangeOrderPopUpChanges
                            var changeOrderType = singeChangeOrder.ModificationTypeId == 1 ? 'Value' :
                                singeChangeOrder.ModificationTypeId == 2 ? 'Schedule Impact' : 'Value & Schedule Impact'


                            $('#program_element_change_order_table_id').append(
                                '<tr id="' + singeChangeOrder.ChangeOrderID + '" class="fade-selection-animation clickable-row">' +
                                ' <td style="width: 20px">' +
                                '<input id=rbCo' + singeChangeOrder.ChangeOrderID + ' type="radio" name="rbChangeOrder" value="' + serviceBasePath + 'Request/DocumentByDocID/' + singeChangeOrder.DocumentID + '" />' +
                                '</td >' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderName + '</td>' +
                                '</td >' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.DocumentName + '</td>' +
                                //'<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderName + '</td>' +
                                '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + changeOrderType + '</td>' + // Jignesh-ChangeOrderPopUpChanges
                                //'<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderNumber + '</td>' +
                                //'<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderAmount + '</td>' +
                                //'<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.OrderDate + '</td>' +
                                //'<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderScheduleChange + '</td>' +
                                '<td><input type="button" name="btnviewOrderDetail"  id="viewOrderDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                '<td class="docId" style="display:none;"><span>' + singeChangeOrder.ChangeOrderID + '</span></td>' +
                                '</tr>'
                            );

                            //$('#program_element_change_order_table_id').append(
                            //    '<tr id="' + singeChangeOrder.ChangeOrderID + '" class="fade-selection-animation clickable-row">' +
                            //    ' <td style="width: 20px">' +
                            //    '<input id=rbCo' + singeChangeOrder.ChangeOrderID + ' type="radio" name="rbChangeOrder" value="' + serviceBasePath + 'Request/DocumentByDocID/' + singeChangeOrder.DocumentID + '" />' +
                            //    '</td >' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.DocumentName + '</td>' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderName + '</td>' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.OrderType + '</td>' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderNumber + '</td>' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderAmount + '</td>' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.OrderDate + '</td>' +
                            //    '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderScheduleChange + '</td>' +
                            //    '</tr>'
                            //);
                        }
                    }
                    // }, 3000);


                    $('input[name=rbChangeOrder]').on('click', function (event) {
                        if (wbsTree.getLocalStorage().acl[2] == 1 && wbsTree.getLocalStorage().acl[3] == 0) {
                            $('#ViewUploadFileChangeOrder').removeAttr('disabled');
                            $('#edit_program_element_change_order').removeAttr('disabled');
                        } else {
                            $('#downloadBtnChangeOrder').removeAttr('disabled');
                            $('#ViewUploadFileChangeOrder').removeAttr('disabled');
                            $('#edit_program_element_change_order').removeAttr('disabled');
                        }

                    });
                });
            }

            //Program element change order
            function populateProgramElementChangeOrderTableNew() {
                $('#program_element_change_order_table_id').empty();
                //  alert(FileName);
                for (var x = 0; x < g_program_element_change_order_draft_list.length; x++) {
                    var singeChangeOrder = {};

                    singeChangeOrder = g_program_element_change_order_draft_list[x];

                    console.log(singeChangeOrder);
                    //  alert(singeChangeOrder.DocumentName);

                    $('#program_element_change_order_table_id').append(
                        '<tr id="' + singeChangeOrder.ChangeOrderID + '" class="fade-selection-animation clickable-row">' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.DocumentName + '</td>' + /**/
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderName + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.OrderType + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderNumber + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderAmount + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.OrderDate + '</td>' +
                        '<td class="class-td-LiveView" style="font-family:Verdana, Arial, sans-serif !important;color:#333 !important;text-overflow: ellipsis;white-space: nowrap;">' + singeChangeOrder.ChangeOrderScheduleChange + '</td>' +
                        '</tr>'
                    );

                    //$('#program_element_change_order_table_id').append(
                    //    '<tr id="' + singeChangeOrder.ChangeOrderName + '" class="fade-selection-animation clickable-row">' +
                    //   // '<td class="class-td-LiveView" style="width:20%;">' + singeChangeOrder.DocumentName + '</td>' +
                    //    '<td class="class-td-LiveView" style="width:20%;">' + singeChangeOrder.ChangeOrderName + '</td>' +
                    //    '<td class="class-td-LiveView" style="width:20%;">' + singeChangeOrder.OrderType + '</td>' +
                    //    '<td class="class-td-LiveView" style="width:15%;">' + singeChangeOrder.ChangeOrderNumber + '</td>' +
                    //    '<td class="class-td-LiveView" style="width:15%;">' + singeChangeOrder.ChangeOrderAmount + '</td>' +
                    //    '<td class="class-td-LiveView" style="width:20%;">' + singeChangeOrder.OrderDate + '</td>' +
                    //    '<td class="class-td-LiveView" style="width:50%;">' + singeChangeOrder.ChangeOrderScheduleChange + '</td>' +
                    //    '</tr>'
                    //);
                }
            }

            $('#update_program').unbind('click').on('click', function () {
                console.log("In save==");
                var selectedNode = wbsTree.getSelectedNode();
                var fundToBeAdded = wbsTree.getFundToBeAdded();
                if (fundToBeAdded == null) {
                    fundToBeAdded = [];
                }
                var fundToBeDeleted = wbsTree.getFundToBeDeleted();
                if (fundToBeDeleted == null) {
                    fundToBeDeleted = [];
                }
                var categoryToBeAdded = wbsTree.getCategoryToBeAdded();
                if (categoryToBeAdded == null) {
                    categoryToBeAdded = [];
                }
                var categoryToBeDeleted = wbsTree.getCategoryToBeDeleted();
                if (categoryToBeDeleted == null) {
                    categoryToBeDeleted = [];
                }
                var orgName = selectedNode.name;
                var temp_node = angular.copy(selectedNode);
                // business logic...
                //Delete a program
                var progName = $('#program_name').val().length;

                //Amruta

                var clientList = wbsTree.getClientList();
                var selectedClient = $('#ProgramModal').find('.modal-body #program_client_poc');
                console.log(selectedClient, selectedClient.val());
                selectedNode.ClientID = 0;
                for (var x = 0; x < clientList.length; x++) {

                    console.log("In for loop update_program ubind==>");
                    if (clientList[x].ClientID == selectedClient.val()) {
                        console.log(clientList[x].ClientName, selectedClient.val());
                        selectedNode.ClientID = clientList[x].ClientID;
                        selectedNode.ClientPOC = clientList[x].ClientName;
                    }
                }

                //if ($('#program_name').val().length > 50) {
                //    dhtmlx.alert({
                //        //text: "Program Name cannot exceed 50 characters",
                //        text: "Contract Name cannot exceed 50 characters", //Manasi 23-07-2020
                //        width: "400px"
                //    });
                //    return;
                //}
                if (modal_mode == 'Update') {   //luan here 2

                    selectedNode.name = $('#ProgramModal').find('.modal-body #program_name').val();
                    var modifiedName = selectedNode.name;
                    var isModified = false;
                    if (orgName != modifiedName) {
                        isModified = true;
                    }
                    selectedNode.ProgramManager = $('#ProgramModal').find('.modal-body #program_manager').val();
                    selectedNode.ProgramSponsor = $('#ProgramModal').find('.modal-body #program_sponsor').val();
                    //selectedNode.ClientPOC = $('#ProgramModal').find('.modal-body #program_client_poc').text();
                    selectedNode.ClientID = $('#ProgramModal').find('.modal-body #program_client_poc').val();
                    //Amruta
                    console.log("client POC update===>");
                    console.log(newNode);
                    selectedNode.ClientPhone = $('#ProgramModal').find('.modal-body #program_client_phone').val();
                    selectedNode.ClientEmail = $('#ProgramModal').find('.modal-body #program_client_email').val();

                    //====== Jignesh-AddAddressField-21-01-2021 =======
                    //newNode.ClientAddress = $('#ProgramModal').find('.modal-body #program_client_address').val();
                    selectedNode.ClientAddressLine1 = $('#ProgramModal').find('.modal-body #program_client_address_line1').val();
                    selectedNode.ClientAddressLine2 = $('#ProgramModal').find('.modal-body #program_client_address_line2').val();
                    selectedNode.ClientCity = $('#ProgramModal').find('.modal-body #program_client_city').val();
                    selectedNode.ClientState = $('#ProgramModal').find('.modal-body #program_client_state').val();
                    selectedNode.ClientPONo = $('#ProgramModal').find('.modal-body #program_client_po_num').val();
                    //==================================================


                    selectedNode.ContractNumber = $('#ProgramModal').find('.modal-body #program_contract_number').val();
                    selectedNode.CurrentStartDate = $('#ProgramModal').find('.modal-body #program_current_start_date').val();
                    selectedNode.CurrentEndDate = $('#ProgramModal').find('.modal-body #program_current_end_date').val();
                    selectedNode.ContractValue = $('#ProgramModal').find('.modal-body #program_contract_value').val();   //Manasi 14-07-2020  
                    selectedNode.JobNumber = $('#ProgramModal').find('.modal-body #job_number').val();   //Manasi 04-08-2020

                    selectedNode.BillingPOC = $('#ProgramModal').find('.modal-body #program_billing_poc').val();
                    selectedNode.BillingPOCPhone1 = $('#ProgramModal').find('.modal-body #program_billing_poc_phone_1').val();
                    selectedNode.BillingPOCPhone2 = $('#ProgramModal').find('.modal-body #program_billing_poc_phone_2').val();
                    //====== Jignesh-AddAddressField-21-01-2021 =======
                    //newNode.BillingPOCAddress = $('#ProgramModal').find('.modal-body #program_billing_poc_address').val();
                    selectedNode.BillingPOCAddressLine1 = $('#ProgramModal').find('.modal-body #program_billing_poc_address_line1').val();
                    selectedNode.BillingPOCAddressLine2 = $('#ProgramModal').find('.modal-body #program_billing_poc_address_line2').val();
                    selectedNode.BillingPOCCity = $('#ProgramModal').find('.modal-body #program_billing_poc_city').val();
                    selectedNode.BillingPOCState = $('#ProgramModal').find('.modal-body #program_billing_poc_state').val();
                    selectedNode.BillingPOCPONo = $('#ProgramModal').find('.modal-body #program_billing_poc_po_num').val();
                    //==================================================
                    selectedNode.BillingPOCEmail = $('#ProgramModal').find('.modal-body #program_billing_poc_email').val();
                    selectedNode.BillingPOCSpecialInstruction = $('#ProgramModal').find('.modal-body #program_billing_poc_special_instruction').val();


                    // Check
                    var program_tm_billing_checked = document.getElementById("program_tm_billing").checked;
                    var program_sov_billing_checked = document.getElementById("program_sov_billing").checked;
                    var program_monthly_billing_checked = document.getElementById("program_monthly_billing").checked;
                    var program_Lumpsum = document.getElementById("program_Lumpsum").checked;
                    var program_certified_payroll_checked = document.getElementById("program_certified_payroll").checked;

                    selectedNode.TMBilling = program_tm_billing_checked ? 1 : 0;
                    selectedNode.SOVBilling = program_sov_billing_checked ? 1 : 0;
                    selectedNode.MonthlyBilling = program_monthly_billing_checked ? 1 : 0;
                    selectedNode.Lumpsum = program_Lumpsum ? 1 : 0;
                    selectedNode.CertifiedPayroll = program_certified_payroll_checked ? 1 : 0;

                    selectedNode.ProjectManager = $('#ProgramModal').find('.modal-body #program_project_manager').val();
                    selectedNode.ProjectManagerPhone = $('#ProgramModal').find('.modal-body #program_project_manager_phone').val();
                    selectedNode.ProjectManagerEmail = $('#ProgramModal').find('.modal-body #program_project_manager_email').val();

                    if (wbsTree.getSelectedOrganizationID() == null) {
                        wbsTree.setSelectedOrganizationID($("#selectOrg").val());
                    }

                    //luan here - Find the program project class id
                    var projectClassList = wbsTree.getProjectClassList();
                    var selectedProjectClass = $('#ProgramModal').find('.modal-body #program_project_class');
                    console.log(selectedProjectClass, selectedProjectClass.val());
                    selectedNode.ProjectClassID = 0;
                    for (var x = 0; x < projectClassList.length; x++) {
                        console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                        if (projectClassList[x].ProjectClassName == selectedProjectClass.val()) {
                            selectedNode.ProjectClassID = projectClassList[x].ProjectClassID;
                        }
                    }

                    var locationList = wbsTree.getLocationList();
                    var selectedLocation = $('#ProgramModal').find('.modal-body #program_location');
                    console.log(selectedLocation, selectedLocation.val());
                    selectedNode.LocationID = 0;
                    for (var x = 0; x < locationList.length; x++) {
                        console.log(locationList[x].LocationName, selectedLocation.val());
                        if (locationList[x].LocationName == selectedLocation.val()) {
                            selectedNode.LocationID = locationList[x].LocationID;
                        }
                    }


                    //luan here - Find the employees id
                    var employeeList = wbsTree.getEmployeeList();
                    var selectedProgramManager = $('#ProgramModal').find('.modal-body #program_manager_id');
                    var selectedProgramSponsor = $('#ProgramModal').find('.modal-body #program_sponsor_id');
                    selectedNode.ProgramManagerID = 0;
                    selectedNode.ProgramSponsorID = 0;
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == selectedProgramManager.val()) {   //Program Manager
                            selectedNode.ProgramManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedProgramSponsor.val()) {   //Program Sponsor
                            selectedNode.ProgramSponsorID = employeeList[x].ID;
                        }
                    }

                    //Luan here - tbd 10000
                    if (selectedNode.ProgramManagerID <= 0) selectedNode.ProgramManagerID = 10000;
                    if (selectedNode.ProgramSponsorID <= 0) selectedNode.ProgramSponsorID = 10000;

                    if (!selectedNode.name) {
                        dhtmlx.alert('Contract Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.ContractNumber) {
                        dhtmlx.alert('Contract # is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.ContractValue) {
                        dhtmlx.alert('Original Contract Value is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.ClientPOC) {
                        dhtmlx.alert('Client Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.ProjectManager) {
                        dhtmlx.alert('Contract Manager Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.BillingPOC) {
                        dhtmlx.alert('Billing POC is a required field.');
                        return;
                    }
                    //========================== Jignesh-18-02-2021 =================================
                    if (selectedNode.ClientEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(selectedNode.ClientEmail)) {
                            dhtmlx.alert('Please enter valid Client Email Address.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (selectedNode.ProjectManagerEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(selectedNode.ProjectManagerEmail)) {
                            dhtmlx.alert('Please enter valid Contract Manager Email Address.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (selectedNode.BillingPOCEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(selectedNode.BillingPOCEmail)) {
                            dhtmlx.alert('Please enter valid Email Address for Billing POC.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //================================================================================

                    //========================== Jignesh-01-03-2021 =================================
                    if (selectedNode.ClientPhone.length > 0) {
                        if (selectedNode.ClientPhone.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Client Phone #.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (selectedNode.ProjectManagerPhone.length > 0) {
                        if (selectedNode.ProjectManagerPhone.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Contract Manager Phone #.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (selectedNode.BillingPOCPhone1.length > 0) {
                        if (selectedNode.BillingPOCPhone1.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Billing POC Phone # 1.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (selectedNode.BillingPOCPhone2.length > 0) {
                        if (selectedNode.BillingPOCPhone2.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Billing POC Phone # 2.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //================================================================================

                    ////Manasi 04-08-2020
                    //if (!selectedNode.JobNumber) {
                    //    dhtmlx.alert('Job number is a required field.');
                    //    return;
                    //}

                    //API to Insert/Update
                    wbsTree.getProgram().persist().save({
                        "Operation": 2,
                        "ProgramID": selectedNode.ProgramID,
                        "ProgramName": selectedNode.name.trim(),  //Manasi 16-07-2020
                        "ProgramManager": selectedNode.ProgramManager,
                        "ProgramSponsor": selectedNode.ProgramSponsor,

                        //Added by Amruta for storing client ID of selected client
                        "ClientID": selectedNode.ClientID,
                        "ClientPOC": selectedNode.ClientPOC,
                        "ClientPhone": selectedNode.ClientPhone,
                        "ClientEmail": selectedNode.ClientEmail,
                        //====== Jignesh-AddAddressField-21-01-2021 =======
                        //"ClientAddress": newNode.ClientAddress,
                        "ClientAddressLine1": selectedNode.ClientAddressLine1,
                        "ClientAddressLine2": selectedNode.ClientAddressLine2,
                        "ClientCity": selectedNode.ClientCity,
                        "ClientState": selectedNode.ClientState,
                        "ClientPONo": selectedNode.ClientPONo,
                        //=================================================

                        "ContractNumber": selectedNode.ContractNumber,
                        "CurrentStartDate": selectedNode.CurrentStartDate,
                        "CurrentEndDate": selectedNode.CurrentEndDate,
                        "ContractValue": selectedNode.ContractValue,
                        "JobNumber": selectedNode.JobNumber,   //Manasi 04-08-2020

                        "BillingPOC": selectedNode.BillingPOC,
                        "BillingPOCPhone1": selectedNode.BillingPOCPhone1,
                        "BillingPOCPhone2": selectedNode.BillingPOCPhone2,
                        //====== Jignesh-AddAddressField-21-01-2021 =======
                        //"BillingPOCAddress": newNode.BillingPOCAddress,
                        "BillingPOCAddressLine1": selectedNode.BillingPOCAddressLine1,
                        "BillingPOCAddressLine2": selectedNode.BillingPOCAddressLine2,
                        "BillingPOCCity": selectedNode.BillingPOCCity,
                        "BillingPOCState": selectedNode.BillingPOCState,
                        "BillingPOCPONo": selectedNode.BillingPOCPONo,
                        //==================================================
                        "BillingPOCEmail": selectedNode.BillingPOCEmail,
                        "BillingPOCSpecialInstruction": selectedNode.BillingPOCSpecialInstruction,

                        "TMBilling": selectedNode.TMBilling,
                        "SOVBilling": selectedNode.SOVBilling,
                        "MonthlyBilling": selectedNode.MonthlyBilling,
                        "Lumpsum": selectedNode.Lumpsum,
                        "CertifiedPayroll": selectedNode.CertifiedPayroll,

                        "ProjectManager": selectedNode.ProjectManager,
                        "ProjectManagerPhone": selectedNode.ProjectManagerPhone,
                        "ProjectManagerEmail": selectedNode.ProjectManagerEmail,

                        //luan here
                        "ProgramManagerID": selectedNode.ProgramManagerID,
                        "ProgramSponsorID": selectedNode.ProgramSponsorID,
                        //"ProjectClassID": selectedNode.ProjectClassID, // Jignesh 24-11-2020
                        "LocationID": selectedNode.LocationID,

                        "OrganizationID": wbsTree.getSelectedOrganizationID(),
                        "programFunds": fundToBeAdded,
                        "programCategories": categoryToBeAdded,
                        "categoryToBedeleted": categoryToBeDeleted,
                        "fundToBeDeleted": fundToBeDeleted,
                        "isModified": isModified

                    }, function (response) {
                        isFieldValueChanged = false; // Jignesh-31-03-2021
                        if (response.result.split(',')[0].trim() === "Success") {
                            g_contract_draft_list = [];
                            angular.forEach(fundToBeAdded, function (item) {
                                console.log(item);
                                if (item.ProgramID == "") {
                                    item.ProgramID = selectedNode.ProgramID;
                                }
                            })
                            wbsTree.setOrgProgramFund(fundToBeAdded);
                            wbsTree.setOrgProgramCategory(categoryToBeAdded);
                            angular.forEach(categoryToBeAdded, function (item) {
                                console.log(item);
                                if (item.ProgramID == "") {
                                    item.ProgramID = selectedNode.ProgramID;
                                }
                            })

                            wbsTree.updateTreeNodes(selectedNode);
                            $('#ProgramModal').modal('hide');
                            //window.location.reload();   //Manasi 28-07-2020
                        } else {
                            selectedNode.name = temp_node.name;
                            selectedNode.ProgramManager = temp_node.ProgramManager;
                            selectedNode.ProgramSponsor = temp_node.ProgramSponsor;
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                        }

                    });
                }

                if (modal_mode == "Create") {
                    var newNode = { name: "New Program Element" };
                    var fundList = wbsTree.getFundToBeAdded();

                    console.log(g_contract_draft_list);

                    if (wbsTree.getSelectedOrganizationID() == null) {
                        wbsTree.setSelectedOrganizationID($("#selectOrg").val());
                    }
                    var resultArray;
                    newNode.parent = selectedNode;
                    newNode.name = $('#ProgramModal').find('.modal-body #program_name').val();
                    newNode.ProgramManager = $('#ProgramModal').find('.modal-body #program_manager').val();
                    newNode.ProgramSponsor = $('#ProgramModal').find('.modal-body #program_sponsor').val();
                    newNode.ClientID = $('#ProgramModal').find('.modal-body #program_client_poc').val();
                    //newNode.ClientPOC = $('#ProgramModal').find('.modal-body #program_client_poc').text();
                    //Amruta 
                    debugger;
                    console.log("client POC create===>");
                    console.log(newNode);
                    for (var x = 0; x < clientList.length; x++) {

                        console.log("In for loop create==>");
                        if (clientList[x].ClientID == selectedClient.val()) {
                            console.log(clientList[x].ClientName, selectedClient.val());
                            // newNode.ClientID = clientList[x].ClientID;
                            newNode.ClientPOC = clientList[x].ClientName;
                        }
                    }
                    newNode.ClientPhone = $('#ProgramModal').find('.modal-body #program_client_phone').val();
                    newNode.ClientEmail = $('#ProgramModal').find('.modal-body #program_client_email').val();

                    //====== Jignesh-AddAddressField-21-01-2021 =======
                    //newNode.ClientAddress = $('#ProgramModal').find('.modal-body #program_client_address').val();
                    newNode.ClientAddressLine1 = $('#ProgramModal').find('.modal-body #program_client_address_line1').val();
                    newNode.ClientAddressLine2 = $('#ProgramModal').find('.modal-body #program_client_address_line2').val();
                    newNode.ClientCity = $('#ProgramModal').find('.modal-body #program_client_city').val();
                    newNode.ClientState = $('#ProgramModal').find('.modal-body #program_client_state').val();
                    newNode.ClientPONo = $('#ProgramModal').find('.modal-body #program_client_po_num').val();
                    //==================================================

                    newNode.ContractNumber = $('#ProgramModal').find('.modal-body #program_contract_number').val();
                    newNode.CurrentStartDate = $('#ProgramModal').find('.modal-body #program_current_start_date').val();
                    newNode.CurrentEndDate = $('#ProgramModal').find('.modal-body #program_current_end_date').val();
                    newNode.ContractValue = $('#ProgramModal').find('.modal-body #program_contract_value').val();      //Manasi 14-07-2020
                    newNode.JobNumber = $('#ProgramModal').find('.modal-body #job_number').val();      //Manasi 04-08-2020

                    newNode.BillingPOC = $('#ProgramModal').find('.modal-body #program_billing_poc').val();
                    newNode.BillingPOCPhone1 = $('#ProgramModal').find('.modal-body #program_billing_poc_phone_1').val();
                    newNode.BillingPOCPhone2 = $('#ProgramModal').find('.modal-body #program_billing_poc_phone_2').val();
                    //====== Jignesh-AddAddressField-21-01-2021 =======
                    //newNode.BillingPOCAddress = $('#ProgramModal').find('.modal-body #program_billing_poc_address').val();
                    newNode.BillingPOCAddressLine1 = $('#ProgramModal').find('.modal-body #program_billing_poc_address_line1').val();
                    newNode.BillingPOCAddressLine2 = $('#ProgramModal').find('.modal-body #program_billing_poc_address_line2').val();
                    newNode.BillingPOCCity = $('#ProgramModal').find('.modal-body #program_billing_poc_city').val();
                    newNode.BillingPOCState = $('#ProgramModal').find('.modal-body #program_billing_poc_state').val();
                    newNode.BillingPOCPONo = $('#ProgramModal').find('.modal-body #program_billing_poc_po_num').val();
                    //==================================================
                    newNode.BillingPOCEmail = $('#ProgramModal').find('.modal-body #program_billing_poc_email').val();
                    newNode.BillingPOCSpecialInstruction = $('#ProgramModal').find('.modal-body #program_billing_poc_special_instruction').val();


                    // Check
                    var program_tm_billing_checked = document.getElementById("program_tm_billing").checked;
                    var program_sov_billing_checked = document.getElementById("program_sov_billing").checked;
                    var program_monthly_billing_checked = document.getElementById("program_monthly_billing").checked;
                    var program_Lumpsum = document.getElementById("program_Lumpsum").checked;
                    var program_certified_payroll_checked = document.getElementById("program_certified_payroll").checked;

                    newNode.TMBilling = program_tm_billing_checked ? 1 : 0;
                    newNode.SOVBilling = program_sov_billing_checked ? 1 : 0;
                    newNode.MonthlyBilling = program_monthly_billing_checked ? 1 : 0;
                    newNode.Lumpsum = program_Lumpsum ? 1 : 0;
                    newNode.CertifiedPayroll = program_certified_payroll_checked ? 1 : 0;

                    newNode.ProjectManager = $('#ProgramModal').find('.modal-body #program_project_manager').val();
                    newNode.ProjectManagerPhone = $('#ProgramModal').find('.modal-body #program_project_manager_phone').val();
                    newNode.ProjectManagerEmail = $('#ProgramModal').find('.modal-body #program_project_manager_email').val();

                    //luan here - Find the program project class id
                    var projectClassList = wbsTree.getProjectClassList();
                    var selectedProjectClass = $('#ProgramModal').find('.modal-body #program_project_class');
                    console.log(selectedProjectClass, selectedProjectClass.val());
                    newNode.ProjectClassID = 0;
                    for (var x = 0; x < projectClassList.length; x++) {
                        console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                        if (projectClassList[x].ProjectClassName == selectedProjectClass.val()) {
                            newNode.ProjectClassID = projectClassList[x].ProjectClassID;
                        }
                    }
                    //newNode.ProjectClassID = projectClassList[0].ProjectClassID;    Manasi 13-07-2020

                    //luan here - Find the program location id
                    var locationList = wbsTree.getLocationList();
                    var selectedLocation = $('#ProgramModal').find('.modal-body #program_location');
                    console.log(selectedLocation, selectedLocation.val());
                    newNode.LocationID = 0;
                    for (var x = 0; x < locationList.length; x++) {
                        console.log(locationList[x].LocationName, selectedLocation.val());
                        if (locationList[x].LocationName == selectedLocation.val()) {
                            newNode.LocationID = locationList[x].LocationID;
                        }
                    }

                    //luan here - Find the employees id
                    var employeeList = wbsTree.getEmployeeList();
                    var selectedProgramManager = $('#ProgramModal').find('.modal-body #program_manager_id');
                    var selectedProgramSponsor = $('#ProgramModal').find('.modal-body #program_sponsor_id');
                    newNode.ProgramManagerID = 0;
                    newNode.ProgramSponsorID = 0;
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == selectedProgramManager.val()) {   //Program Manager
                            newNode.ProgramManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedProgramSponsor.val()) {   //Program Sponsor
                            newNode.ProgramSponsorID = employeeList[x].ID;
                        }
                    }

                    //Luan here - tbd 10000
                    if (newNode.ProgramManagerID <= 0) newNode.ProgramManagerID = 10000;
                    if (newNode.ProgramSponsorID <= 0) newNode.ProgramSponsorID = 10000;

                    newNode.level = "Program";
                    newNode.CurrentCost = 0;
                    newNode.programFunds = fundToBeAdded;
                    newNode.programCategories = categoryToBeAdded;
                    if (!newNode.name) {
                        dhtmlx.alert('Contract Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!newNode.ContractNumber) {
                        dhtmlx.alert('Contract # is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!newNode.ContractValue) {
                        dhtmlx.alert('Original Contract Value is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!newNode.ClientID) {
                        dhtmlx.alert('Client Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!newNode.ProjectManager) {
                        dhtmlx.alert('Contract Manager Name is a required field'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!newNode.BillingPOC) {
                        dhtmlx.alert('Billing POC is a required field');
                        return;
                    }
                    //========================== Jignesh-18-02-2021 =================================
                    if (newNode.ClientEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(newNode.ClientEmail)) {
                            dhtmlx.alert('Please enter valid Client Email Address.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (newNode.ProjectManagerEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(newNode.ProjectManagerEmail)) {
                            dhtmlx.alert('Please enter valid Contract Manager Email Address.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (newNode.BillingPOCEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(newNode.BillingPOCEmail)) {
                            dhtmlx.alert('Please enter valid Email Address for Billing POC.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //================================================================================

                    //========================== Jignesh-01-03-2021 =================================
                    if (newNode.ClientPhone.length > 0) {
                        if (newNode.ClientPhone.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Client Phone #.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (newNode.ProjectManagerPhone.length > 0) {
                        if (newNode.ProjectManagerPhone.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Contract Manager Phone #.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (newNode.BillingPOCPhone1.length > 0) {
                        if (newNode.BillingPOCPhone1.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Billing POC Phone # 1.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (newNode.BillingPOCPhone2.length > 0) {
                        if (newNode.BillingPOCPhone2.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Billing POC Phone # 2.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //================================================================================
                    ////Manasi 04-08-2020
                    //if (!newNode.JobNumber) {
                    //    dhtmlx.alert('Job number is a required field.');
                    //    return;
                    //}
                    selectedNode = newNode;
                    var obj = {
                        "Operation": 1,
                        "OrganizationID": wbsTree.getSelectedOrganizationID(),
                        "ProgramID": "",
                        "ProgramName": newNode.name.trim(),   //Manasi 16-07-2020
                        "ProgramManager": newNode.ProgramManager,
                        "ProgramSponsor": newNode.ProgramSponsor,

                        //Added by Amruta for storing client ID of selected client
                        "ClientID": newNode.ClientID,
                        "ClientPOC": newNode.ClientPOC,
                        "ClientPhone": newNode.ClientPhone,
                        "ClientEmail": newNode.ClientEmail,
                        //====== Jignesh-AddAddressField-21-01-2021 =======
                        //"ClientAddress": newNode.ClientAddress,
                        "ClientAddressLine1": newNode.ClientAddressLine1,
                        "ClientAddressLine2": newNode.ClientAddressLine2,
                        "ClientCity": newNode.ClientCity,
                        "ClientState": newNode.ClientState,
                        "ClientPONo": newNode.ClientPONo,
                        //=================================================
                        "ContractNumber": newNode.ContractNumber,
                        "CurrentStartDate": newNode.CurrentStartDate,
                        "CurrentEndDate": newNode.CurrentEndDate,
                        "ContractValue": newNode.ContractValue,   //Manasi 14-07-2020
                        "JobNumber": newNode.JobNumber,            //Manasi 04-08-2020

                        "BillingPOC": newNode.BillingPOC,
                        "BillingPOCPhone1": newNode.BillingPOCPhone1,
                        "BillingPOCPhone2": newNode.BillingPOCPhone2,
                        //====== Jignesh-AddAddressField-21-01-2021 =======
                        //"BillingPOCAddress": newNode.BillingPOCAddress,
                        "BillingPOCAddressLine1": newNode.BillingPOCAddressLine1,
                        "BillingPOCAddressLine2": newNode.BillingPOCAddressLine2,
                        "BillingPOCCity": newNode.BillingPOCCity,
                        "BillingPOCState": newNode.BillingPOCState,
                        "BillingPOCPONo": newNode.BillingPOCPONo,
                        //==================================================
                        "BillingPOCEmail": newNode.BillingPOCEmail,
                        "BillingPOCSpecialInstruction": newNode.BillingPOCSpecialInstruction,

                        "TMBilling": newNode.TMBilling,
                        "SOVBilling": newNode.SOVBilling,
                        "MonthlyBilling": newNode.MonthlyBilling,
                        "Lumpsum": newNode.Lumpsum,
                        "CertifiedPayroll": newNode.CertifiedPayroll,

                        "ProjectManager": newNode.ProjectManager,
                        "ProjectManagerPhone": newNode.ProjectManagerPhone,
                        "ProjectManagerEmail": newNode.ProjectManagerEmail,

                        //luan here
                        "ProgramManagerID": selectedNode.ProgramManagerID,
                        "ProgramSponsorID": selectedNode.ProgramSponsorID,
                        //"ProjectClassID": selectedNode.ProjectClassID,  // Jignesh 24-11-2020
                        "LocationID": selectedNode.LocationID,

                        "programFunds": fundToBeAdded,
                        "programCategories": categoryToBeAdded
                    }



                    //API to Insert Program
                    wbsTree.getProgram().persist().save(obj,
                        function (response) {
                            isFieldValueChanged = false; // Jignesh-31-03-2021
                            if (response.result.split(',')[0].trim() === "Success") {

                                console.log("-------ADDING A PROGRAM-------");
                                resultArray = response.result.split(',');
                                //console.log("ADDED");
                                $('#ProgramModal').modal('hide');
                                newNode.ProgramID = resultArray[1];

                                //Saving drafted 
                                for (var x = 0; x < g_contract_draft_list.length; x++) {
                                    g_contract_draft_list[x].ProgramID = newNode.ProgramID;
                                }

                                var indexOutter = 0;

                                var apiRegisterContract = function () {
                                    if (indexOutter >= g_contract_draft_list.length) {
                                        return;
                                    }

                                    var tempListSingle = [];
                                    tempListSingle.push(g_contract_draft_list[indexOutter]);

                                    wbsTree.getUpdateContract({ ProjectID: 1 }).save(tempListSingle,
                                        function (response) {
                                            g_contract_draft_list = [];
                                            if (response.result) {
                                                if (response.result.split(',')[0].trim() === "Success") {
                                                    //$('#ProgramModal').modal('hide');

                                                    var newContractID = response.result.split(',')[1].trim();

                                                    //Upload draft documents
                                                    var index = 0;

                                                    if (tempListSingle.length > 0 && tempListSingle[0].DocumentDraft.length > 0) {
                                                        docTypeID = tempListSingle[0].DocumentDraft[0].docTypeID;
                                                        formdata = tempListSingle[0].DocumentDraft[0].formdata;

                                                        var request = {
                                                            method: 'POST',
                                                            url: serviceBasePath + '/uploadFiles/Post/ProgramContract/0/0/0/' + newContractID + '/0/' + docTypeID,
                                                            data: formdata, //fileUploadProject.files, //$scope.
                                                            ignore: true,
                                                            headers: {
                                                                'Content-Type': undefined
                                                            }
                                                        };

                                                        var angularHttp = wbsTree.getAngularHttp();
                                                        angularHttp(request).then(function success(d) {
                                                            console.log(d);
                                                            //window.location.reload();   //Manasi 28-07-2020
                                                        });
                                                    }

                                                } else {
                                                    //dhtmlx.alert({ text: response.result, width: '500px' });
                                                    $('#ProgramContractModal').modal('hide');
                                                    $("#ProgramModal").css({ "opacity": "1" });
                                                }
                                                populateContractTable(newNode.ProgramID);
                                            }

                                            apiRegisterContract();
                                            indexOutter++;
                                        });
                                }

                                apiRegisterContract();

                                selectedNode = selectedNode.parent;
                                if (!selectedNode._children && !selectedNode.children) {//Empty parent
                                    selectedNode._children = [newNode];
                                    selectedNode = toggleChildren(selectedNode);
                                }
                                else if (selectedNode._children) { //Parent is collapsed
                                    selectedNode._children.push(newNode);
                                    selectedNode = toggleChildren(selectedNode);
                                }
                                else if (selectedNode.children) { //Parent is expanded
                                    selectedNode.children.push(newNode);

                                }
                                wbsTree.setSelectedNode(selectedNode);
                                wbsTree.updateTreeNodes(selectedNode);
                                wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());

                            } else {
                                selectedNode.name = temp_node.name;
                                selectedNode.ProgramManager = temp_node.ProgramManager;
                                selectedNode.ProgramSponsor = temp_node.ProgramSponsor;


                                dhtmlx.alert({ text: response.result, width: '500px' });
                                //  $('#ProgramModal').modal('hide');
                            }
                        });
                }
            });

            function updateProgramElementContractInfo(contract) {
                modal.find('.modal-body #program_element_contract_number').val(contract.ContractNumber);
                modal.find('.modal-body #program_element_contract_start_date').val(contract.ContractStartDate);
                modal.find('.modal-body #program_element_contract_end_date').val(contract.ContractEndDate);
            }

            //luan quest 3/22
            $('#update_program_element').unbind('click').on('click', function () {
                var selectedNode = wbsTree.getSelectedNode();
                console.log(selectedNode);
                var orgName = wbsTree.getOrgProjectName();
                console.log(orgName);
                var orgClientPONumber = wbsTree.getOrgClientPONumber;
                var orgAmount = wbsTree.getOrgAmount;
                var orgQuickbookJobNumber = wbsTree.getOrgQuickbookJobNumber;
                var orgLocation = wbsTree.getLocation;
                var orgProjectDescription = wbsTree.getOrgProjectDescription;
                var isModified = false;
                var temp_node = jQuery.extend({}, selectedNode);
                var programElementID = wbsTree.getSelectedProgramElementID();
                if (wbsTree.getSelectedOrganizationID() == null) {
                    wbsTree.setSelectedOrganizationID($("#selectOrg").val());
                }
                if ($('#project_name').val().length > 50) {
                    dhtmlx.alert({
                        text: "Project name cannot exceed 50 characters",
                        width: "400px"
                    });
                    return;
                }


                if (modal_mode == 'Update') {   //luan here
                    selectedNode.name = $('#ProgramElementModal').find('.modal-body #project_name').val();
                    selectedNode.ProgramElementName = $('#ProgramElementModal').find('.modal-body #project_name').val();	//luan eats
                    selectedNode.ProjectManager = $('#ProgramElementModal').find('.modal-body #project_manager').val();
                    selectedNode.ProjectSponsor = $('#ProgramElementModal').find('.modal-body #project_sponsor').val();
                    selectedNode.Director = $('#ProgramElementModal').find('.modal-body #director').val();
                    selectedNode.Scheduler = $('#ProgramElementModal').find('.modal-body #scheduler').val();
                    selectedNode.ExecSteeringComm = $('#ProgramElementModal').find('.modal-body #exec_steering_comm').val();
                    selectedNode.VicePresident = $('#ProgramElementModal').find('.modal-body #vice_president').val();
                    selectedNode.FinancialAnalyst = $('#ProgramElementModal').find('.modal-body #financial_analyst').val();
                    selectedNode.CapitalProjectAssistant = $('#ProgramElementModal').find('.modal-body #capital_project_assistant').val();
                    selectedNode.CostDescription = $('#ProgramElementModal').find('.modal-body #cost_description').val();
                    selectedNode.ScheduleDescription = $('#ProgramElementModal').find('.modal-body #schedule_description').val();
                    selectedNode.ScopeQualityDescription = $('#ProgramElementModal').find('.modal-body #scope_quality_description').val();
                    selectedNode.LaborRate = $('#ProgramElementModal').find('.modal-body #labor_rate').val();
                    selectedNode.LatLong = wbsTree.getProjectMap().getCoordinates();

                    selectedNode.CostDescription = $('#ProgramElementModal').find('.modal-body #cost_description').val();
                    selectedNode.ScheduleDescription = $('#ProgramElementModal').find('.modal-body #schedule_description').val();
                    selectedNode.ProgramElementManager = $('#ProgramElementModal').find('.modal-body #program_element_manager_name').val();
                    selectedNode.ClientProjectManager = $('#ProgramElementModal').find('.modal-body #program_element_client_pm').val();
                    selectedNode.ClientPhoneNumber = $('#ProgramElementModal').find('.modal-body #program_element_client_phone').val();


                    //luan here
                    selectedNode.ProjectNumber = $('#ProgramElementModal').find('.modal-body #project_number').val();
                    selectedNode.ContractNumber = $('#ProgramElementModal').find('.modal-body #contract_number').val();
                    selectedNode.ProjectStartDate = $('#ProgramElementModal').find('.modal-body #project_start_date').val();    //datepicker - program element
                    selectedNode.ContractStartDate = $('#ProgramElementModal').find('.modal-body #contract_start_date').val();  //datepicker - program element
                    selectedNode.LocationName = $('#ProgramElementModal').find('.modal-body #program_element_location_name').val();

                    selectedNode.ContractEndDate = $('#ProgramElementModal').find('.modal-body #program_element_phone').val();
                    selectedNode.ProjectValueContract = $('#ProgramElementModal').find('.modal-body #program_element_contract_value').val();
                    selectedNode.ProjectValueTotal = $('#ProgramElementModal').find('.modal-body #program_element_total_value').val();

                    //luan here - Find the contract id
                    var contractList = wbsTree.getContractList();
                    var selectedContract = $('#ProgramElementModal').find('.modal-body #program_element_contract');
                    selectedNode.ContractID = 0;
                    for (var x = 0; x < contractList.length; x++) {
                        if (contractList[x].ContractName == selectedContract.val()) {
                            selectedNode.ContractID = contractList[x].ContractID;
                        }
                    }

                    //labor rate
                    var selectedLaborRate = $('#ProgramElementModal').find('modal-body #labor_rate');
                    for (var x = 0; x < costOverheadTypes.length; x++) {
                        if (costOverheadTypes[x].CostOverHeadType == selectedLaborRate.val()) {
                            selectedNode.CostOverheadTypeID = costOverheadTypes[x].ID;
                        }
                    }
                    console.log(selectedLaborRate);
                    //luan here - Find the project type id
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var selectedProjectType = $('#ProgramElementModal').find('.modal-body #project_type');
                    selectedNode.ProjectTypeID = 0;
                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == selectedProjectType.val()) {
                            selectedNode.ProjectTypeID = projectTypeList[x].ProjectTypeID;
                        }
                    }
                    selectedNode.ProjectTypeID = projectTypeList[0].ProjectTypeID;

                    //luan here - Find the project class id
                    var projectClassList = wbsTree.getProjectClassList();
                    var selectedProjectClass = $('#ProgramElementModal').find('.modal-body #project_class');
                    console.log(selectedProjectClass, selectedProjectClass.val());
                    selectedNode.ProjectClassID = 0;
                    for (var x = 0; x < projectClassList.length; x++) {
                        console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                        if (projectClassList[x].ProjectClassName == selectedProjectClass.val()) {
                            selectedNode.ProjectClassID = projectClassList[x].ProjectClassID;
                        }
                    }

                    //luan here - Find the client id
                    // var clientList = wbsTree.getClientList();
                    /* var selectedClient = $('#ProgramElementModal').find('.modal-body #client');
                     
                     //selectedNode.ClientID = 0;
                     for (var x = 0; x < clientList.length; x++) {
                         console.log(clientList[x].ClientName, selectedClient.val());
                         if (clientList[x].ClientName == selectedClient.val()) {
                             selectedNode.ClientID = clientList[x].ClientID;
                            // selectedNode.ClientPOC = clientList[x].ClientName;
                         }
                     }*/
                    //selectedNode.ClientID = clientList[0].ClientID;

                    // Find location id
                    var locationList = wbsTree.getLocationList();
                    var selectedLocation = $('#ProgramElementModal').find('.modal-body #location');
                    selectedNode.LocationID = 0;
                    for (var x = 0; x < locationList.length; x++) {
                        console.log(locationList[x].LocationName, selectedLocation.val());
                        if (locationList[x].LocationName == selectedLocation.val()) {
                            selectedNode.LocationID = locationList[x].LocationID;
                        }
                    }
                    selectedNode.LocationID = locationList[0].LocationID;

                    //luan here - Find the employees id
                    var employeeList = wbsTree.getEmployeeList();
                    var selectedProjectManager = $('#ProgramElementModal').find('.modal-body #project_manager_id');  //$('#ProgramElementModal').find('.modal-body #program_element_manager_name');
                    // Pritesh commented on 11 jun 2020
                    var selectedDirector = $('#ProgramElementModal').find('.modal-body #director_id');
                    var selectedScheduler = $('#ProgramElementModal').find('.modal-body #scheduler_id');
                    var selectedVicePresident = $('#ProgramElementModal').find('.modal-body #vice_president_id');
                    var selectedFinancialAnalyst = $('#ProgramElementModal').find('.modal-body #financial_analyst_id');
                    var selectedCapitalProjectAssistant = $('#ProgramElementModal').find('.modal-body #capital_project_assistant_id');
                    selectedNode.ProjectManagerID = 0;
                    selectedNode.DirectorID = 0;
                    selectedNode.SchedulerID = 0;
                    selectedNode.VicePresidentID = 0;
                    selectedNode.FinancialAnalystID = 0;
                    selectedNode.CapitalProjectAssistantID = 0;
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == selectedProjectManager.val()) {   //Project Manager
                            //if (employeeList[x].Name == selectedNode.ProgramElementManager) { //Manasi
                            selectedNode.ProjectManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedDirector.val()) {   //Director
                            selectedNode.DirectorID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedScheduler.val()) {   //Scheduler
                            selectedNode.SchedulerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedVicePresident.val()) {   //Vice Presdient
                            selectedNode.VicePresidentID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedFinancialAnalyst.val()) {   //Financial Analyst
                            selectedNode.FinancialAnalystID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedCapitalProjectAssistant.val()) {   //Capital Project Assistant
                            selectedNode.CapitalProjectAssistantID = employeeList[x].ID;
                        }
                    }
                    selectedNode.ProjectManagerID = selectedNode.ProjectManagerID <= 0 ? 10000 : selectedNode.ProjectManagerID;	//DEFAULT DUMMY    //Manasi

                    selectedNode.ProjectStartDate = $('#ProgramElementModal').find('.modal-body #program_element_Start_Date').val();  //Manasi 21-10-2020
                    selectedNode.ProjectNTPDate = $('#ProgramElementModal').find('.modal-body #program_element_Start_Date').val();   //Manasi 23-10-2020


                    // --------------------- Add start date end date po date 21-01-2021 --------------------------------------------------

                    selectedNode.ProjectPODate = $('#ProgramElementModal').find('.modal-body #program_element_PO_Date').val();
                    selectedNode.ProjectPStartDate = $('#ProgramElementModal').find('.modal-body #program_element_PStart_Date').val();
                    selectedNode.ProjectPEndDate = $('#ProgramElementModal').find('.modal-body #program_element_PEnd_Date').val();

                    //------------------------------------------------------------------------------------------------------

                    //----------------- Swapnil save approvers details 27/10/2020------------------------------------------

                    var approversDetails = [];
                    var employeeList = wbsTree.getEmployeeList();
                    var approversDdl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers select');
                    var approversLbl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers label');
                    for (var i = 0; i < approversDdl.length; i++) {
                        var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                        var EmpId = $('#' + approversDdl[i].id).val();
                        var EmpName = "";
                        for (var x = 0; x < employeeList.length; x++) {
                            if (employeeList[x].ID == $('#' + approversDdl[i].id).val()) {
                                EmpName = employeeList[x].Name;
                                break;
                            }
                        }
                        if (!EmpId) {
                            dhtmlx.alert('Select ' + approversLbl[i].innerText + ' as it is required field.');
                            return;
                        }

                        var approver = {
                            ApproverMatrixId: ApproverMatrixId,
                            EmpId: EmpId,
                            EmpName: EmpName,
                            ProjectId: programElementID
                        };
                        approversDetails.push(approver);
                        console.log(approversDetails);
                    }

                    //--------------------------------------------------------------------------------------
                    //--------------------Swapnil 27/10/2020--------------------------------------------------
                    //if (!selectedNode.SchedulerID) {
                    //    dhtmlx.alert('Select Scheduler as it is required field.');
                    //    return;
                    //}


                    //if (!selectedNode.FinancialAnalystID) {
                    //    dhtmlx.alert('Select Financial Analyst as it is required field.');
                    //    return;
                    //}
                    ////if (!newNode.ProgramElementManager) { 
                    //if (!selectedNode.ProjectManagerID) {
                    //    dhtmlx.alert('Select Project Manager as it is required field.');
                    //    return;
                    //}

                    //if (!selectedNode.DirectorID) {
                    //    dhtmlx.alert('Select Director as it is required field.');
                    //    return;
                    //}


                    //if (!selectedNode.CapitalProjectAssistantID) {
                    //    dhtmlx.alert('Select Capital Project Assistant as it is required field.');
                    //    return;
                    //}


                    //if (!selectedNode.VicePresidentID) {
                    //    dhtmlx.alert('Select Vice President as it is required field.');
                    //    return;
                    //}
                    //------------------------------------------------------------------------------------

                    if (!selectedProjectClass.val()) {
                        dhtmlx.alert('Select Managing Department as it is required field.');
                        return;
                    }
                    //============================== Jignesh-19-02-2021 ====================
                    // Removed from the Top and placed here
                    if (!selectedNode.ProgramElementName) {
                        dhtmlx.alert('Project Title cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }
                    //======================================================================
                    //if (!selectedNode.ProgramElementName) {
                    //    dhtmlx.alert('Project name is a required field.');
                    //    return;
                    //}
                    ////if (!selectedProjectType.val()) {
                    ////    dhtmlx.alert('Project type is a required field.');
                    ////    return;
                    ////}
                    //if (!selectedProjectClass.val()) {
                    //    dhtmlx.alert('Division is a required field.');
                    //    return;
                    //}


                    if (!selectedLocation.val()) {
                        dhtmlx.alert('Location is a required field.');
                        return;
                    }

                    // if (!selectedProjectManager.val()) {
                    //       dhtmlx.alert('Project Manager is a required field.');
                    //        return;
                    //      }
                    //if (!selectedLaborRate.val()) {
                    //    dhtmlx.alert('Labor rate is a required field.');
                    //    return;
                    //}
                    if (!/^\d+$/.test(selectedNode.ProjectNumber)) {
                        dhtmlx.alert('Project # field is required. Contact your administrator.');
                        return;
                    }

                    if (!selectedNode.ProjectStartDate) {
                        dhtmlx.alert('Project NTP Date cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }

                    // --------------------- Add start date end date po date 21-01-2021 Swapnil --------------------------------------------------

                    //if (!selectedNode.ProjectPODate) {
                    //    dhtmlx.alert('Project PO Date cannot be empty.'); // Jignesh-02-03-2021
                    //    return;
                    //}

                    if (!selectedNode.ProjectPStartDate) {
                        dhtmlx.alert('Project Start Date cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }

                    if (!selectedNode.ProjectPEndDate) {
                        dhtmlx.alert('Project End Date cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }

                    // -----------------------------------------------------------------------
                    //================== Jignesh-01-03-2021 =============================
                    if (selectedNode.ClientPhoneNumber.length > 0) {
                        if (selectedNode.ClientPhoneNumber.length != 12) {
                            dhtmlx.alert('Enter valid 10 digit Client Phone #.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //===================================================================

                    var modifiedName = selectedNode.name;
                    var modifiedClientPONumber = selectedNode.ClientPONumber;
                    var modifiedAmount = selectedNode.Amount;
                    var modifiedQuickbookJobNumber = selectedNode.QuickbookJobNumber;
                    var modifiedLocationName = selectedNode.LocationName;
                    var modifiedLocation = selectedNode.Location;
                    var modifiedProjectDescription = selectedNode.ProjectDescription;


                    if (modifiedName !== orgName || modifiedClientPONumber !== orgClientPONumber || modifiedAmount !== orgAmount
                        || modifiedProjectDescription !== orgProjectDescription || modifiedLocation !== orgLocation || modifiedQuickbookJobNumber !== orgQuickbookJobNumber
                        || modifiedLocationName !== orgLocationName)
                        isModified = true;
                    //API to Insert/Update
                    console.log(wbsTree.getScopeToBeDeleted());
                    console.log(selectedNode.ProjectNumber);

                    //Luan here - tbd 10000
                    if (selectedNode.DirectorID <= 0) {
                        selectedNode.DirectorID = 10000;
                        originalInfo.DirectorID = 10000;
                    }
                    if (selectedNode.SchedulerID <= 0) {
                        selectedNode.SchedulerID = 10000;
                        originalInfo.SchedulerID = 10000;
                    }
                    if (selectedNode.VicePresidentID <= 0) {
                        selectedNode.VicePresidentID = 10000;
                        originalInfo.VicePresidentID = 10000;
                    }
                    if (selectedNode.FinancialAnalystID <= 0) {
                        selectedNode.FinancialAnalystID = 10000;
                        originalInfo.FinancialAnalystID = 10000;
                    }
                    if (selectedNode.CapitalProjectAssistantID <= 0) {
                        selectedNode.CapitalProjectAssistantID = 10000;
                        originalInfo.CapitalProjectAssistantID = 10000;
                    }
                    console.log("Program element update");
                    console.log(selectedNode);

                    var objToSave = {
                        "Operation": 2,
                        "ProjectID": selectedNode.ProjectID,
                        "ProjectName": selectedNode.ProjectName,	//luan eats
                        "ProgramElementName": selectedNode.ProgramElementName,	//luan eats
                        "ProgramElementManager": selectedNode.ProgramElementManager,
                        "ProjectManager": selectedNode.ProjectManager,
                        "ProjectSponsor": selectedNode.ProjectSponsor,
                        "Director": selectedNode.Director,
                        "Scheduler": selectedNode.Scheduler,
                        "ExecSteeringComm": selectedNode.ExecSteeringComm,
                        "VicePresident": selectedNode.VicePresident,
                        "FinancialAnalyst": selectedNode.FinancialAnalyst,

                        //luan here
                        "ProjectTypeID": selectedNode.ProjectTypeID,
                        "ProjectClassID": selectedNode.ProjectClassID,
                        "LocationID": selectedNode.LocationID,

                        //dummy
                        "ProgramElementManagerID": 10000,
                        "ProgramElementSponsorID": 10000,


                        //Added by Amruta for storing client ID of selected client in contract
                        "ClientID": selectedNode.parent.ClientID,
                        "ClientPOC": selectedNode.parent.ClientPOC,
                        "LocationID": selectedNode.LocationID,
                        "ProjectManagerID": selectedNode.ProjectManagerID,
                        "DirectorID": selectedNode.DirectorID,
                        "SchedulerID": selectedNode.SchedulerID,
                        "VicePresidentID": selectedNode.VicePresidentID,
                        "FinancialAnalystID": selectedNode.FinancialAnalystID,
                        "CapitalProjectAssistantID": selectedNode.CapitalProjectAssistantID,

                        "ProjectNumber": selectedNode.ProjectNumber,
                        "ContractNumber": selectedNode.ContractNumber,
                        "ProjectStartDate": selectedNode.ProjectStartDate,		//datepicker - program element
                        "ContractStartDate": selectedNode.ContractStartDate,    //datepicker - program element

                        "CostDescription": selectedNode.CostDescription,
                        "ScheduleDescription": selectedNode.ScheduleDescription,
                        "ScopeQualityDescription": selectedNode.ScopeQualityDescription,

                        "ClientProjectManager": selectedNode.ClientProjectManager,
                        "ClientPhoneNumber": selectedNode.ClientPhoneNumber,

                        "LocationName": selectedNode.LocationName,
                        "ProjectValueContract": selectedNode.ProjectValueContract,
                        "ProjectValueTotal": selectedNode.ProjectValueTotal,
                        "ContractID": selectedNode.ContractID,

                        "CapitalProjectAssistant": selectedNode.CapitalProjectAssistant,
                        "LatLong": wbsTree.getProjectMap().getCoordinates(),
                        "OrganizationID": wbsTree.getSelectedOrganizationID(),
                        "ProgramElementID": programElementID,
                        "isModified": isModified,

                        //"ProjectStartDate": selectedNode.ProjectStartDate  //Manasi 21-10-2020
                        "ProjectNTPDate": selectedNode.ProjectNTPDate,   //Manasi 23-10-2020

                        // --------------------- Add start date end date po date 21-01-2021 --------------------------------------------------

                        "ProjectPODate": selectedNode.ProjectPODate,
                        "ProjectPStartDate": selectedNode.ProjectPStartDate,
                        "ProjectPEndDate": selectedNode.ProjectPEndDate,

                        //------------------------------------------------------------------------------------------------------


                        "ApproversDetails": approversDetails
                    };
                    console.log(objToSave);
                    wbsTree.getProgramElement().persist().save(objToSave, function (response) {
                        if (response.result == "Duplicate") {
                            dhtmlx.alert('Failed to update. Project # already exist');
                            return;
                        } else if (response.result.split(',')[0].trim() === "Success") {
                            isFieldValueChanged = false; // Jignesh-31-03-2021
                            originalInfo = objToSave;

                            //selectedNode.CurrentCost="1111";
                            console.log(selectedNode);
                            selectedNode.name = selectedNode.ProjectNumber + ". " + selectedNode.name; // Jignesh-19-03-2021
                            wbsTree.updateTreeNodes(selectedNode);

                            //wbsTree.updateTreeNodes(selectedNode);

                            wbsTree.getWBSTrendTree().trendGraph();
                            wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());
                            $('#ProgramElementModal').modal('hide');
                            //window.location.reload();   //Manasi 28-07-2020
                        } else {

                            dhtmlx.alert({
                                text: 'Failed to save',
                                width: '500px'
                            });
                            // selectedNode = jQuery.extend({},temp_node);
                            //     selectedNode.name =temp_node.name;
                            //     selectedNode.ProjectManager = temp_node.ProjectManager;
                            //     selectedNode.ProjectSponsor = temp_node.ProjectSponsor;
                            //     selectedNode.Director =  temp_node.Director;
                            //     selectedNode.Scheduler =  temp_node.Scheduler;
                            //     selectedNode.ExecSteeringComm =  temp_node.ExecSteeringComm;
                            //     selectedNode.VicePresident =  temp_node.VicePresident;
                            //     selectedNode.FinancialAnalyst =  temp_node.FinancialAnalyst;
                            //     selectedNode.CapitalProjectAssistant =  temp_node.CapitalProjectAssistant;
                            //     selectedNode.LatLong = temp_node.LatLong;
                            //     wbsTree.setSelectedNode(temp_node);
                        }

                    });

                }


                if (modal_mode == "Create") {   //luan here
                    var newNode = { name: "New Program Element" };
                    console.log(selectedNode);

                    newNode.parent = selectedNode;

                    newNode.name = $('#ProgramElementModal').find('.modal-body #project_name').val();	//luan eats
                    newNode.ProgramElementName = $('#ProgramElementModal').find('.modal-body #project_name').val();	//luan eats
                    //newNode.ProgramElementManager = $('#ProgramElementModal').find('.modal-body #program_element_manager_name').val();
                    //newNode.ProjectSponsor = $('#ProgramElementModal').find('.modal-body #project_sponsor').val();
                    //newNode.Director = $('#ProgramElementModal').find('.modal-body #director').val();
                    //newNode.Scheduler = $('#ProgramElementModal').find('.modal-body #scheduler').val();
                    //newNode.ExecSteeringComm = $('#ProgramElementModal').find('.modal-body #exec_steering_comm').val();
                    //newNode.VicePresident = $('#ProgramElementModal').find('.modal-body #vice_president').val();
                    //newNode.FinancialAnalyst = $('#ProgramElementModal').find('.modal-body #financial_analyst').val();
                    //newNode.CapitalProjectAssistant = $('#ProgramElementModal').find('.modal-body #capital_project_assistant').val();

                    //------------------------Manasi 30-07-2020-------------------------------------------------------------------
                    newNode.ProgramElementManager = $('#ProgramElementModal').find('.modal-body #project_manager_id').val();
                    newNode.ProjectSponsor = $('#ProgramElementModal').find('.modal-body #project_sponsor').val();
                    newNode.Director = $('#ProgramElementModal').find('.modal-body #director_id').val();
                    newNode.Scheduler = $('#ProgramElementModal').find('.modal-body #scheduler_id').val();
                    newNode.ExecSteeringComm = $('#ProgramElementModal').find('.modal-body #exec_steering_comm').val();
                    newNode.VicePresident = $('#ProgramElementModal').find('.modal-body #vice_president_id').val();
                    newNode.FinancialAnalyst = $('#ProgramElementModal').find('.modal-body #financial_analyst_id').val();
                    newNode.CapitalProjectAssistant = $('#ProgramElementModal').find('.modal-body #capital_project_assistant_id').val();
                    //--------------------------------------------------------------------------------------------------------------

                    newNode.CostDescription = $('#ProgramElementModal').find('.modal-body #cost_description').val();
                    newNode.ScheduleDescription = $('#ProgramElementModal').find('.modal-body #schedule_description').val();
                    newNode.ScopeQualityDescription = $('#ProgramElementModal').find('.modal-body #scope_quality_description').val();
                    newNode.LatLong = wbsTree.getProjectMap().getCoordinates();

                    console.log(newNode);

                    newNode.ClientProjectManager = $('#ProgramElementModal').find('.modal-body #program_element_client_pm').val();
                    newNode.ClientPhoneNumber = $('#ProgramElementModal').find('.modal-body #program_element_client_phone').val();

                    //luan here

                    newNode.ProjectNumber = $('#ProgramElementModal').find('.modal-body #project_number').val() == '' ? '0001' : $('#ProgramElementModal').find('.modal-body #project_number').val();
                    newNode.ContractNumber = $('#ProgramElementModal').find('.modal-body #contract_number').val();
                    newNode.ProjectStartDate = $('#ProgramElementModal').find('.modal-body #project_start_date').val();		//datepicker - program element
                    newNode.ContractStartDate = $('#ProgramElementModal').find('.modal-body #contract_start_date').val();   //datepicker - program element

                    newNode.ContractEndDate = $('#ProgramElementModal').find('.modal-body #contract_end_date').val();
                    newNode.ProjectValueContract = $('#ProgramElementModal').find('.modal-body #program_element_contract_value').val();
                    newNode.ProjectValueTotal = $('#ProgramElementModal').find('.modal-body #program_element_total_value').val();
                    newNode.LocationName = $('#ProgramElementModal').find('.modal-body #program_element_location_name').val();

                    //luan here - Find the contract id
                    var contractList = wbsTree.getContractList();
                    var selectedContract = $('#ProgramElementModal').find('.modal-body #program_element_contract');
                    newNode.ContractID = 0;
                    for (var x = 0; x < contractList.length; x++) {
                        if (contractList[x].ContractName == selectedContract.val()) {
                            newNode.ContractID = contractList[x].ContractID;
                        }
                    }

                    //luan here - Find the project type id
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var selectedProjectType = $('#ProgramElementModal').find('.modal-body #project_type');
                    newNode.ProjectTypeID = 0;
                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == selectedProjectType.val()) {
                            newNode.ProjectTypeID = projectTypeList[x].ProjectTypeID;
                        }
                    }
                    newNode.ProjectTypeID = projectTypeList[0].ProjectTypeID;

                    //luan here - Find the project class id
                    var projectClassList = wbsTree.getProjectClassList();
                    var selectedProjectClass = $('#ProgramElementModal').find('.modal-body #project_class');
                    console.log(selectedProjectClass, selectedProjectClass.val());
                    newNode.ProjectClassID = 0;
                    for (var x = 0; x < projectClassList.length; x++) {
                        console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                        if (projectClassList[x].ProjectClassName == selectedProjectClass.val()) {
                            newNode.ProjectClassID = projectClassList[x].ProjectClassID;
                        }
                    }

                    //luan here - Find the client id
                    /*var clientList = wbsTree.getClientList();
                    var selectedClient = $('#ProgramElementModal').find('.modal-body #client');
                    console.log(selectedClient, selectedClient.val());
                    selectedNode.ClientID = 0;
                    for (var x = 0; x < clientList.length; x++) {
                        console.log(clientList[x].ClientName, selectedClient.val());
                        if (clientList[x].ClientName == selectedClient.val()) {
                            selectedNode.ClientID = clientList[x].ClientID;
                           // selectedNode.ClientPOC = clientList[x].ClientName;
                        }
                    }
                    selectedNode.ClientID = clientList[0].ClientID;*/

                    // find location id
                    var locationList = wbsTree.getLocationList();
                    var selectedLocation = $('#ProgramElementModal').find('.modal-body #location');
                    console.log(selectedLocation, selectedLocation.val());
                    newNode.LocationID = 0;
                    for (var x = 0; x < locationList.length; x++) {
                        console.log(locationList[x].LocationName, selectedLocation.val());
                        if (locationList[x].LocationName == selectedLocation.val()) {
                            newNode.LocationID = locationList[x].LocationID;
                        }
                    }
                    newNode.LocationID = locationList[0].LocationID;;

                    //luan here - Find the employees id
                    var employeeList = wbsTree.getEmployeeList();
                    var selectedProjectManager = $('#ProgramElementModal').find('.modal-body #project_manager_id');
                    var selectedDirector = $('#ProgramElementModal').find('.modal-body #director_id');
                    var selectedScheduler = $('#ProgramElementModal').find('.modal-body #scheduler_id');
                    var selectedVicePresident = $('#ProgramElementModal').find('.modal-body #vice_president_id');
                    var selectedFinancialAnalyst = $('#ProgramElementModal').find('.modal-body #financial_analyst_id');
                    var selectedCapitalProjectAssistant = $('#ProgramElementModal').find('.modal-body #capital_project_assistant_id');
                    var selectedLaborRate = $('#ProgramElementModal').find('.modal-body #labor_rate_id');
                    newNode.ProjectManagerID = 0;
                    newNode.DirectorID = 0;
                    newNode.SchedulerID = 0;
                    newNode.VicePresidentID = 0;
                    newNode.FinancialAnalystID = 0;
                    newNode.CapitalProjectAssistantID = 0;
                    //newNode.CostOverheadTypeID = 0;   Manasi
                    newNode.CostOverheadTypeID = 1;
                    //for (var x = 0; x < costOverheadTypes.length; x++) {
                    //    if (costOverheadTypes[x].CostOverHeadType == selectedLaborRate.val()) {
                    //        newNode.CostOverheadTypeID = costOverheadTypes[x].ID;
                    //    }
                    //}
                    for (var x = 0; x < employeeList.length; x++) {
                        //if (employeeList[x].Name == selectedProjectManager.val()) {   //Project Manager
                        if (employeeList[x].Name == newNode.ProgramElementManager) {  //Manasi
                            newNode.ProjectManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedDirector.val()) {   //Director
                            newNode.DirectorID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedScheduler.val()) {   //Scheduler
                            newNode.SchedulerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedVicePresident.val()) {   //Vice Presdient
                            newNode.VicePresidentID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedFinancialAnalyst.val()) {   //Financial Analyst
                            newNode.FinancialAnalystID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedCapitalProjectAssistant.val()) {   //Capital Project Assistant
                            newNode.CapitalProjectAssistantID = employeeList[x].ID;
                        }
                    }
                    //newNode.ProjectManagerID = employeeList[0].ID;	//DEFAULT DUMMY
                    newNode.ProjectManagerID = newNode.ProjectManagerID = 0 ? employeeList[0].ID : newNode.ProjectManagerID;	//DEFAULT DUMMY    //Manasi

                    newNode.ProjectStartDate = $('#ProgramElementModal').find('.modal-body #program_element_Start_Date').val();	  //Manasi 21-10-2020
                    newNode.ProjectNTPDate = $('#ProgramElementModal').find('.modal-body #program_element_Start_Date').val();   //Manasi 23-10-2020

                    // --------------------- Add start date end date po date 21-01-2021 --------------------------------------------------

                    newNode.ProjectPODate = $('#ProgramElementModal').find('.modal-body #program_element_PO_Date').val();
                    newNode.ProjectPStartDate = $('#ProgramElementModal').find('.modal-body #program_element_PStart_Date').val();
                    newNode.ProjectPEndDate = $('#ProgramElementModal').find('.modal-body #program_element_PEnd_Date').val();

                    //------------------------------------------------------------------------------------------------------


                    //----------------- Swapnil save approvers details 25/10/2020------------------------------------------

                    var approversDetails = [];
                    var employeeList = wbsTree.getEmployeeList();
                    var approversDdl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers select');
                    var approversLbl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers label');
                    for (var i = 0; i < approversDdl.length; i++) {
                        var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                        var EmpId = $('#' + approversDdl[i].id).val();
                        var EmpName = "";
                        for (var x = 0; x < employeeList.length; x++) {
                            if (employeeList[x].ID == $('#' + approversDdl[i].id).val()) {
                                EmpName = employeeList[x].Name;
                                break;
                            }
                        }
                        if (!EmpId) {
                            dhtmlx.alert('Select ' + approversLbl[i].innerText + ' as it is required field.');
                            return;
                        }

                        var approver = {
                            ApproverMatrixId: ApproverMatrixId,
                            EmpId: EmpId,
                            EmpName: EmpName,
                            ProjectId: 0
                        };
                        approversDetails.push(approver);
                        console.log(approversDetails);
                    }

                    //--------------------------------------------------------------------------------------

                    //---------------------------Swapnil 26/10/2020-----------------------------------------------------------------
                    //if (!newNode.SchedulerID) {    
                    //    dhtmlx.alert('Select Scheduler as it is required field.');
                    //    return;
                    //}


                    //if (!newNode.FinancialAnalystID) {   
                    //    dhtmlx.alert('Select Financial Analyst as it is required field.');
                    //    return;
                    //}
                    ////Manasi 23-07-2020
                    ////if (!newNode.ProgramElementManager) { 
                    //if (!newNode.ProjectManagerID) {    
                    //    dhtmlx.alert('Select Project Manager as it is required field.');
                    //    return;
                    //}

                    //if (!newNode.DirectorID) {
                    //    dhtmlx.alert('Select Director as it is required field.');
                    //    return;
                    //}


                    //if (!newNode.CapitalProjectAssistantID) {
                    //    dhtmlx.alert('Select Capital Project Assistant as it is required field.');
                    //    return;
                    //}


                    //if (!newNode.VicePresidentID) {
                    //    dhtmlx.alert('Select Vice President as it is required field.');
                    //    return;
                    //}
                    //--------------------------------------------------------------------------------------------
                    if (!selectedProjectClass.val()) {
                        dhtmlx.alert('Select Managing Department as it is required field.');
                        return;
                    }
                    //================================== Jignesh-19-02-2021 ========================
                    //  Removed from the Top and placed here
                    if (!newNode.ProgramElementName) {
                        dhtmlx.alert('Project Title cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }
                    //==============================================================================
                    //if (!selectedProjectManager.val()) {
                    //    dhtmlx.alert('Project Manager is a required field.');
                    //    return;
                    //}
                    //if (!/^\d+$/.test(newNode.ProjectNumber)) {
                    //    dhtmlx.alert('Project # field is required. Contact your administrator.');
                    //    return;
                    //}

                    //Manasi 21-10-2020
                    if (!newNode.ProjectStartDate) {
                        dhtmlx.alert("Project NTP Date cannot be empty."); // Jignesh-02-03-2021
                        return;
                    }

                    // --------------------- Add start date end date po date 21-01-2021 Swapnil --------------------------------------------------

                    //if (!newNode.ProjectPODate) {
                    //    dhtmlx.alert('Project PO Date cannot be empty.'); // Jignesh-02-03-2021
                    //    return;
                    //}

                    if (!newNode.ProjectPStartDate) {
                        dhtmlx.alert('Project Start Date cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }

                    if (!newNode.ProjectPEndDate) {
                        dhtmlx.alert('Project End Date cannot be empty.'); // Jignesh-02-03-2021
                        return;
                    }

                    // -----------------------------------------------------------------------------------------------------
                    //================== Jignesh-01-03-2021 =============================
                    if (newNode.ClientPhoneNumber.length > 0) {
                        if (newNode.ClientPhoneNumber.length != 12) {
                            dhtmlx.alert('Enter valid 10 Client Phone #.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //===================================================================

                    newNode.level = "ProgramElement";
                    newNode.CurrentCost = 0;
                    newNode.CurrentStartDate = "N/A";

                    selectedNode = newNode;
                    //Get project scope

                    console.log(selectedNode);

                    //Luan here - tbd 10000
                    if (selectedNode.DirectorID <= 0) selectedNode.DirectorID = 10000;
                    if (selectedNode.SchedulerID <= 0) selectedNode.SchedulerID = 10000;
                    if (selectedNode.VicePresidentID <= 0) selectedNode.VicePresidentID = 10000;
                    if (selectedNode.FinancialAnalystID <= 0) selectedNode.FinancialAnalystID = 10000;
                    if (selectedNode.CapitalProjectAssistantID <= 0) selectedNode.CapitalProjectAssistantID = 10000;
                    if (selectedNode.ProjectManagerID <= 0) selectedNode.ProjectManagerID = 10000;

                    //API to Insert Project
                    var objToSave = {

                        "Operation": 1,
                        "ProgramID": selectedNode.parent.ProgramID,
                        "ProgramElementID": selectedNode.parent.ProgramElementID,
                        "ProjectName": selectedNode.ProjectName,	//luan eats
                        "ProgramElementName": selectedNode.ProgramElementName,	//luan eats
                        "ProjectManager": selectedNode.ProjectManager,
                        "ProgramElementManager": selectedNode.ProgramElementManager,
                        "ProjectSponsor": selectedNode.ProjectSponsor,
                        "Director": selectedNode.Director,
                        "Scheduler": selectedNode.Scheduler,
                        "ExecSteeringComm": selectedNode.ExecSteeringComm,
                        "VicePresident": selectedNode.VicePresident,
                        "FinancialAnalyst": selectedNode.FinancialAnalyst,

                        //luan here
                        "ProjectTypeID": selectedNode.ProjectTypeID,
                        "ProjectClassID": selectedNode.ProjectClassID,
                        "LocationID": selectedNode.LocationID,

                        //dummy
                        "ProgramElementManagerID": 10000,
                        "ProgramElementSponsorID": 10000,

                        //Added by Amruta for storing client ID of selected client in contract
                        "ClientID": selectedNode.parent.ClientID,
                        "ClientPOC": selectedNode.parent.ClientPOC,
                        "ProjectManagerID": selectedNode.ProjectManagerID,
                        "DirectorID": selectedNode.DirectorID,
                        "SchedulerID": selectedNode.SchedulerID,
                        "VicePresidentID": selectedNode.VicePresidentID,
                        "FinancialAnalystID": selectedNode.FinancialAnalystID,
                        "CapitalProjectAssistantID": selectedNode.CapitalProjectAssistantID,

                        "ProjectNumber": selectedNode.ProjectNumber,
                        "ContractNumber": selectedNode.ContractNumber,
                        "ProjectStartDate": selectedNode.ProjectStartDate,		//datepicker - program element
                        "ContractStartDate": selectedNode.ContractStartDate,    //datepicker - program element

                        "CostDescription": selectedNode.CostDescription,
                        "ScheduleDescription": selectedNode.ScheduleDescription,
                        "ScopeQualityDescription": selectedNode.ScopeQualityDescription,

                        "ClientProjectManager": selectedNode.ClientProjectManager,
                        "ClientPhoneNumber": selectedNode.ClientPhoneNumber,

                        "LocationName": selectedNode.LocationName,
                        "ProjectValueContract": selectedNode.ProjectValueContract,
                        "ProjectValueTotal": selectedNode.ProjectValueTotal,
                        "ContractID": selectedNode.ContractID,

                        "CapitalProjectAssistant": selectedNode.CapitalProjectAssistant,
                        "LatLong": wbsTree.getProjectMap().getCoordinates(),
                        "OrganizationID": wbsTree.getSelectedOrganizationID(),
                        "ProjectNTPDate": selectedNode.ProjectNTPDate,    //Manasi 23-10-2020


                        // --------------------- Add start date end date po date 21-01-2021 --------------------------------------------------

                        "ProjectPODate": selectedNode.ProjectPODate,
                        "ProjectPStartDate": selectedNode.ProjectPStartDate,
                        "ProjectPEndDate": selectedNode.ProjectPEndDate,

                        //------------------------------------------------------------------------------------------------------


                        "ApproversDetails": approversDetails

                    };
                    console.log(objToSave);
                    wbsTree.getProgramElement().persist().save(objToSave, function (response) {
                        console.log(response);
                        if (response.result == "Duplicate") {
                            dhtmlx.alert('Failed to update. Project # already exist');
                            return;
                        }
                        console.log("-------ADDING A SUPER PROJECT-------");

                        if (response.result.split(',')[0].trim() === "Success") {
                            isFieldValueChanged = false; // Jignesh-31-03-2021
                            resultArray = response.result.split(',');
                            newNode.ProgramElementID = resultArray[1];
                            newNode.ProgramID = resultArray[2];
                            newNode.name = response.result.split(',')[3].trim() + ". " + newNode.name; // Jignesh-19-03-2021

                            //Upload draft documents
                            var index = 0;

                            var apiUpload = function () {
                                if (index >= wbsTree.getProgramElementFileDraft().length) {
                                    return;
                                }

                                docTypeID = wbsTree.getProgramElementFileDraft()[index].docTypeID;
                                formdata = wbsTree.getProgramElementFileDraft()[index].formdata;

                                var request = {
                                    method: 'POST',
                                    url: serviceBasePath + '/uploadFiles/Post/ProgramElement/0/' + newNode.ProgramElementID + '/0/0/0/' + docTypeID,
                                    data: formdata, //fileUploadProject.files, //$scope.
                                    ignore: true,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                };

                                var angularHttp = wbsTree.getAngularHttp();
                                angularHttp(request).then(function success(d) {
                                    index++;
                                    apiUpload();
                                });
                            }

                            apiUpload();



                            //Saving drafted program element milestone
                            var objToSave = {};
                            var listToSave = [];
                            for (var x = 0; x < g_program_element_milestone_draft_list.length; x++) {
                                g_program_element_milestone_draft_list[x].ProgramElementID = newNode.ProgramElementID;
                                objToSave = g_program_element_milestone_draft_list[x];
                                objToSave.Operation = 1;
                                listToSave.push(objToSave);
                            }

                            var apiRegisterProgramElementMilestone = function () {
                                wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave,
                                    function (response) {
                                        if (response.result) {
                                            if (response.result.split(',')[0].trim() === "Success") {
                                                g_program_element_milestone_draft_list = [];
                                                console.log('program element milestone saved successfully');
                                            } else {
                                                //dhtmlx.alert({ text: response.result, width: '500px' });
                                                $('#ProgramElementMilestoneModal').modal('hide');
                                                $("#ProgramElementModal").css({ "opacity": "1" });
                                            }
                                            populateProgramElementMilestoneTable(newNode.ProgramElementID);
                                        }
                                    });
                            }

                            apiRegisterProgramElementMilestone();


                            //Saving drafted program element change order
                            var objToSave = {};
                            var listToSave = [];
                            for (var x = 0; x < g_program_element_change_order_draft_list.length; x++) {
                                g_program_element_change_order_draft_list[x].ProgramElementID = newNode.ProgramElementID;
                                objToSave = g_program_element_change_order_draft_list[x];
                                objToSave.Operation = 1;
                                listToSave.push(objToSave);
                            }

                            var apiRegisterProgramElementChangeOrder = function () {
                                wbsTree.getUpdateChangeOrder({ ProjectID: 1 }).save(listToSave,
                                    function (response) {
                                        if (response.result) {
                                            if (response.result.split(',')[0].trim() === "Success") {
                                                g_program_element_change_order_draft_list = [];
                                                console.log('program element change order saved successfully');

                                            } else {
                                                //dhtmlx.alert({ text: response.result, width: '500px' });
                                                $('#ProgramElementChangeOrderModal').modal('hide');
                                                $("#ProgramElementModal").css({ "opacity": "1" });
                                            }
                                            populateProgramElementChangeOrderTable(newNode.ProgramElementID);

                                        }
                                        //window.location.reload();   //Manasi 28-07-2020
                                    });
                            }

                            apiRegisterProgramElementChangeOrder();


                            $('#ProgramElementModal').modal('hide');
                            selectedNode.ProjectNumber = response.result.split(',')[3].trim(); // Jignesh-19-03-2021
                            selectedNode = selectedNode.parent;
                            if (!selectedNode._children && !selectedNode.children) {//Empty parent
                                selectedNode._children = [newNode];
                                selectedNode = toggleChildren(selectedNode);
                            }
                            else if (selectedNode._children) { //Parent is collapsed
                                selectedNode._children.push(newNode);
                                selectedNode = toggleChildren(selectedNode);
                            }
                            else if (selectedNode.children) { //Parent is expanded
                                // newNode.projectNumber = response.result.split(',')[3].trim(); // Jignesh-19-03-2021
                                selectedNode.children.push(newNode);


                                //wbsTree.updateTreeNodes(selectedNode); // swapnil 03-09-2020

                                wbsTree.getWBSTrendTree().trendGraph();
                                wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());
                                $('#ProjectModal').modal('hide');
                            }
                            else {

                                dhtmlx.alert({
                                    text: response.result,
                                    width: '500px'
                                });


                            }
                            wbsTree.setSelectedNode(selectedNode);
                            wbsTree.updateTreeNodes(selectedNode);
                        } else {

                            selectedNode.ProgramElementName = temp_node.ProgramElementName;	//luan eats
                            selectedNode.ProgramElementManager = temp_node.ProgramElementManager;
                            selectedNode.ProgramElementSponsor = temp_node.ProgramElementSponsor;
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                            //  wbsTree.setSelectedNode(temp_node);
                        }
                    });
                }
            });

            $("#update_project_scope").unbind('click').on('click', function () {
                var selectedNode = wbsTree.getSelectedNode();
                var scopeTable = $("#scopeTable").find('.scope');
                var rows = scopeTable.find('tr');
                var descriptionList = wbsTree.getDescriptionList();
                console.log(descriptionList);
                var listToSave = [];
                var scopeToDelete = [];
                scopeToDelete = wbsTree.getScopeToBeDeleted();
                console.log(scopeToDelete);
                console.debug("ROWS", rows);
                $.each(rows, function (index) {
                    var rowData = $(this).find('td');
                    console.log();
                    var obj = {};
                    obj.Area = $($(rowData[1]).find('#dropLabel')).text();
                    obj.Asset = $($(rowData[2]).find("#assetLabel")).text();
                    obj.ImpactType = $($(rowData[3]).find('#impactLabel')).text();
                    obj.Description = descriptionList[index];
                    obj.ProjectID = selectedNode.ProjectID;
                    obj.isNew = $(rowData[5]).text();
                    obj.Id = $(rowData[6]).text();
                    //obj.description
                    listToSave.push(obj);
                });
                console.log(listToSave);
                angular.forEach(listToSave, function (item) {
                    if (item.isNew == "true") {
                        //add
                        item.Operation = 1;
                    } else if (item.isNew == "false") {
                        item.Operation = 2;
                    }
                })
                var orgListToSave = jQuery.extend({}, listToSave);
                angular.forEach(scopeToDelete, function (item) {
                    item.Operation = 3;
                    listToSave.push(item);
                });
                console.log(listToSave);

                wbsTree.getProjectScope().persist().save(listToSave, function (response) {
                    console.log(response);
                    console.log(orgListToSave);
                    selectedNode.projectScopes = orgListToSave;
                    wbsTree.updateTreeNodes(selectedNode);
                    console.log(wbsTree.getSelectedNode());
                    $("#ProjectScopeModal").modal('toggle');
                });
            });


            //luan quest 3/22  Pritesh 28jul2020 added billing poc
            $('#update_project').unbind('click').on('click', function () {
                console.log("In element save");
                var selectedNode = wbsTree.getSelectedNode();

                var selected = $('.picklist').find('.select.selected select');
                var projectWhiteListToSave = [];

                for (var x = 0; x < selected[0].length; x++) {
                    projectWhiteListToSave.push({
                        "Operation": 1,
                        EmployeeID: selected[0][x].id,
                        ProjectID: selectedNode.ProjectID,
                        UserID: ''
                    });
                }
                console.log(projectWhiteListToSave);

                if (projectWhiteListToSave.length == 0) {
                    projectWhiteListToSave.push({
                        "Operation": 2,
                        EmployeeID: 0,
                        ProjectID: selectedNode.ProjectID,
                        UserID: ''
                    });
                }
                console.log(projectWhiteListToSave);

                var selectedNode = wbsTree.getSelectedNode();
                console.log(selectedNode);
                var orgName = wbsTree.getOrgProjectName();
                console.log(orgName);
                var isModified = false;
                var temp_node = jQuery.extend({}, selectedNode);
                var programElementID = wbsTree.getSelectedProgramElementID();
                if (wbsTree.getSelectedOrganizationID() == null) {
                    wbsTree.setSelectedOrganizationID($("#selectOrg").val());
                }
                if ($('#project_name').val().length > 50) {
                    dhtmlx.alert({
                        text: "Program Name cannot exceed 50 characters",
                        width: "400px"
                    });
                    return;
                }

                if ($('#project_element_name').val().length > 50) {
                    dhtmlx.alert({
                        text: "Project Element Name cannot exceed 50 characters",
                        width: "400px"
                    });
                    return;
                }
                if (modal_mode == 'Update') {   //luan here
                    selectedNode.name = $('#ProjectModal').find('.modal-body #project_element_name').val();
                    selectedNode.ProjectName = $('#ProjectModal').find('.modal-body #project_element_name').val();	//luan eats
                    selectedNode.ProjectSponsor = $('#ProjectModal').find('.modal-body #project_sponsor').val();
                    //------------------- Swapnil 02-09-2020------------------------------------------------------------------------
                    //selectedNode.Director = $('#ProjectModal').find('.modal-body #director').val();
                    //selectedNode.Scheduler = $('#ProjectModal').find('.modal-body #scheduler').val();
                    //selectedNode.ExecSteeringComm = $('#ProjectModal').find('.modal-body #exec_steering_comm').val();
                    //selectedNode.VicePresident = $('#ProjectModal').find('.modal-body #vice_president').val();
                    //selectedNode.FinancialAnalyst = $('#ProjectModal').find('.modal-body #financial_analyst').val();
                    //selectedNode.CapitalProjectAssistant = $('#ProjectModal').find('.modal-body #capital_project_assistant').val();

                    selectedNode.Director = $('#ProjectModal').find('.modal-body #project_element_director_id').val();
                    selectedNode.Scheduler = $('#ProjectModal').find('.modal-body #project_element_scheduler_id').val();
                    selectedNode.ExecSteeringComm = $('#ProjectModal').find('.modal-body #exec_steering_comm').val();
                    selectedNode.VicePresident = $('#ProjectModal').find('.modal-body #project_element_vice_president_id').val();
                    selectedNode.FinancialAnalyst = $('#ProjectModal').find('.modal-body #project_element_financial_analyst_id').val();
                    selectedNode.CapitalProjectAssistant = $('#ProjectModal').find('.modal-body #project_element_capital_project_assistant_id').val();

                    //For project Access COntrol
                    debugger;
                    selectedNode.employeeAllowedList = $('#ProjectModal').find('.modal-body #emp_class').val();
                    console.log("Employee vIsibility==>");
                    console.log(selectedNode.employeeAllowedList);
                   


                    //-----------------------------------------------------------------------------------------------------------------
                    selectedNode.CostDescription = $('#ProjectModal').find('.modal-body #cost_description').val();
                    selectedNode.ScheduleDescription = $('#ProjectModal').find('.modal-body #schedule_description').val();
                    selectedNode.ScopeQualityDescription = $('#ProjectModal').find('.modal-body #scope_quality_description').val();
                    selectedNode.LaborRate = $('#ProjectModal').find('.modal-body #labor_rate').val();
                    selectedNode.LatLong = wbsTree.getProjectMap().getCoordinates();

                    //project element
                    selectedNode.ProjectElementNumber = $('#ProjectModal').find('.modal-body #project_element_number').val();
                    selectedNode.ClientPONumber = $('#ProjectModal').find('.modal-body #project_element_po_number').val();
                    selectedNode.Amount = $('#ProjectModal').find('.modal-body #project_element_amount').val();
                    selectedNode.QuickbookJobNumber = $('#ProjectModal').find('.modal-body #project_element_quickbookJobNumber').val();
                    selectedNode.LocationName = $('#ProjectModal').find('.modal-body #project_element_locationName').val();
                    selectedNode.Location = $('#ProjectModal').find('.modal-body #project_element_location').val();
                    selectedNode.ProjectDescription = $('#ProjectModal').find('.modal-body #project_element_description').val();

                    // Billing POC Pritesh 28jul2020

                    selectedNode.BillingPOC = $('#ProjectModal').find('.modal-body #program_billing_poc1').val();
                    selectedNode.BillingPOCPhone1 = $('#ProjectModal').find('.modal-body #program_billing_poc_phone_11').val();
                    selectedNode.BillingPOCPhone2 = $('#ProjectModal').find('.modal-body #program_billing_poc_phone_21').val();

                    //====== Jignesh-AddAddressField-21-01-2021 =======
                    selectedNode.BillingPOCAddress = $('#ProjectModal').find('.modal-body #program_billing_poc_address1').val();
                    selectedNode.BillingPOCAddressLine1 = $('#ProjectModal').find('.modal-body #program1_billing_poc_address_line1').val();
                    selectedNode.BillingPOCAddressLine2 = $('#ProjectModal').find('.modal-body #program1_billing_poc_address_line2').val();
                    selectedNode.BillingPOCCity = $('#ProjectModal').find('.modal-body #program1_billing_poc_city').val();
                    selectedNode.BillingPOCState = $('#ProjectModal').find('.modal-body #program1_billing_poc_state').val();
                    selectedNode.BillingPOCPONo = $('#ProjectModal').find('.modal-body #program1_billing_poc_po_num').val();
                    //==================================================
                    selectedNode.BillingPOCEmail = $('#ProjectModal').find('.modal-body #program_billing_poc_email1').val();
                    selectedNode.BillingPOCSpecialInstruction = $('#ProjectModal').find('.modal-body #program_billing_poc_special_instruction1').val();


                    // Check
                    var program_tm_billing_checked = document.getElementById("program_tm_billing1").checked;
                    var program_sov_billing_checked = document.getElementById("program_sov_billing1").checked;
                    var program_monthly_billing_checked = document.getElementById("program_monthly_billing1").checked;
                    var program_Lumpsum = document.getElementById("program_Lumpsum1").checked;
                    var program_certified_payroll_checked = document.getElementById("program_certified_payroll1").checked;

                    selectedNode.TMBilling = program_tm_billing_checked ? 1 : 0;
                    selectedNode.SOVBilling = program_sov_billing_checked ? 1 : 0;
                    selectedNode.MonthlyBilling = program_monthly_billing_checked ? 1 : 0;
                    selectedNode.Lumpsum = program_Lumpsum ? 1 : 0;
                    selectedNode.CertifiedPayroll = program_certified_payroll_checked ? 1 : 0;


                    //luan here
                    selectedNode.ProjectNumber = $('#ProjectModal').find('.modal-body #project_number').val();
                    selectedNode.ContractNumber = $('#ProjectModal').find('.modal-body #contract_number').val();
                    selectedNode.ProjectStartDate = $('#ProjectModal').find('.modal-body #element_start_date').val();    //datepicker - project
                    selectedNode.ContractStartDate = $('#ProjectModal').find('.modal-body #element_end_date').val();		//datepicker - project 

                    //
                    var selectedLaborRate = $('#ProjectModal').find('modal-body #labor_rate');
                    selectedLaborRate.val(1);  //Manasi
                    for (var x = 0; x < costOverheadTypes.length; x++) {
                        if (costOverheadTypes[x].CostOverHeadType == selectedLaborRate.val()) {
                            selectedNode.CostOverheadTypeID = costOverheadTypes[x].ID;
                        }
                    }
                    console.log(selectedLaborRate);
                    //luan here - Find the project type id
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var selectedProjectType = $('#ProjectModal').find('.modal-body #project_type');
                    selectedNode.ProjectTypeID = 0;
                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == selectedProjectType.val()) {
                            selectedNode.ProjectTypeID = projectTypeList[x].ProjectTypeID;
                        }
                    }

                    ////luan here - Find the project class id
                    //var projectClassList = wbsTree.getProjectClassList();
                    //var selectedProjectClass = $('#ProjectModal').find('.modal-body #project_element_class');
                    //console.log(selectedProjectClass, selectedProjectClass.val());
                    //selectedNode.ProjectClassID = 0;
                    //for (var x = 0; x < projectClassList.length; x++) {
                    //    console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                    //    if (projectClassList[x].ProjectClassName == selectedProjectClass.val()) {
                    //        selectedNode.ProjectClassID = projectClassList[x].ProjectClassID;
                    //    }
                    //}
                    var serviceClassList = wbsTree.getServiceClassList();
                    var selectedServiceClass = $('#ProjectModal').find('.modal-body #service_class');
                    console.log(selectedServiceClass, selectedServiceClass.val());
                    selectedNode.ProjectClassID = 0;
                    for (var x = 0; x < serviceClassList.length; x++) {
                        // console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                        if (serviceClassList[x].Description.trim() == selectedServiceClass.val()) {
                            selectedNode.ProjectClassID = serviceClassList[x].ID;
                        }
                    }


                    // selectedNode.ProjectClassID = "7";

                    //var angularHttp = wbsTree.getAngularHttp();
                    //angularHttp.get(serviceBasePath + 'Request/ServiceClass').then(function (response) {

                    //    var projApproverDetails = response.data.result;
                    //    var projectClassDropDown = modal.find('.modal-body #service_class');
                    //    var projectClassList = projApproverDetails;
                    //    var projectClassName = '';
                    //    projectClassDropDown.empty();

                    //    for (var x = 0; x < projectClassList.length; x++) {
                    //        if (projectClassList[x].ID == selectedNode.ID) {
                    //            projectClassName = projectClassList[x].Description
                    //        }

                    //        if (projectClassList[x].Description == null) {
                    //            continue;
                    //        }
                    //        projectClassDropDown.append('<option selected="false">' + projectClassList[x].Description + '</option>');
                    //    }
                    //    projectClassDropDown.val(projectClassName);

                    //});
                    // var angularHttp = wbsTree.getAngularHttp();
                    //angularHttp.get(serviceBasePath + 'Request/ServiceClass').then(function (response) {
                    //    var projectClassList = response.data.result;
                    //var selectedProjectClass = $('#ProjectModal').find('.modal-body #service_class');
                    //console.log(selectedProjectClass, selectedProjectClass.val());
                    //newNode.ProjectClassID = 0;
                    //for (var x = 0; x < projectClassList.length; x++) {
                    //    console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                    //    if (projectClassList[x].Description == selectedProjectClass.val()) {
                    //        newNode.ProjectClassID = projectClassList[x].ID;
                    //    }
                    //}
                    //});


                    //luan here - Find the client id
                    var clientList = wbsTree.getClientList();
                    var selectedClient = $('#ProjectModal').find('.modal-body #client');
                    selectedNode.ClientID = 0;
                    for (var x = 0; x < clientList.length; x++) {
                        console.log(clientList[x].ClientName, selectedClient.val());
                        if (clientList[x].ClientName == selectedClient.val()) {
                            selectedNode.ClientID = clientList[x].ClientID;
                        }
                    }

                    // find the location id
                    var locationList = wbsTree.getLocationList();
                    var selectedLocation = $('#ProjectModal').find('.modal-body #project_element_location');
                    selectedNode.LocationID = locationList[0].LocationID;
                    for (var x = 0; x < locationList.length; x++) {
                        console.log(locationList[x].LocationName, selectedLocation.val());
                        if (locationList[x].LocationName == selectedLocation.val()) {
                            selectedNode.LocationID = locationList[x].LocationID;
                        }
                    }

                    //lob
                    var selectedLob = $('#ProjectModal').find('.modal-body #project_lob');

                    lobList = wbsTree.getLineOfBusinessList();
                    for (var x = 0; x < lobList.length; x++) {
                        if (lobList[x].LOBName == selectedLob.val())
                            selectedNode.LineOfBusinessID = lobList[x].ID;
                    }

                    //luan here - Find the employees id
                    //---------------------------------------------Swapnil 02-09-2020 -----------------------------------------------------

                    var selectedProjectManager = $('#ProjectModal').find('.modal-body #project_element_project_manager_id');
                    var selectedDirector = $('#ProjectModal').find('.modal-body #project_element_director_id');
                    var selectedScheduler = $('#ProjectModal').find('.modal-body #project_element_scheduler_id');
                    var selectedVicePresident = $('#ProjectModal').find('.modal-body #project_element_vice_president_id');
                    var selectedFinancialAnalyst = $('#ProjectModal').find('.modal-body #project_element_financial_analyst_id');
                    var selectedCapitalProjectAssistant = $('#ProjectModal').find('.modal-body #project_element_capital_project_assistant_id');

                    //-------------------------------------------------------------------------------------------------------------------------
                    var employeeList = wbsTree.getEmployeeList();   //Swapnil 01-10-2020
                    selectedNode.ProjectManagerID = 0;
                    selectedNode.DirectorID = 0;
                    selectedNode.SchedulerID = 0;
                    selectedNode.VicePresidentID = 0;
                    selectedNode.FinancialAnalystID = 0;
                    selectedNode.CapitalProjectAssistantID = 0;
                    var orgClientPONumber = wbsTree.getOrgClientPONumber;
                    var orgAmount = wbsTree.getOrgAmount;
                    var orgQuickbookJobNumber = wbsTree.getOrgQuickbookJobNumber;
                    var orgLocationName = wbsTree.getOrgLocationName;
                    var orgLocation = wbsTree.getOrgLocation;
                    var orgProjectDescription = wbsTree.getOrgProjectDescription;
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == selectedProjectManager.val()) {   //Project Manager
                            selectedNode.ProjectManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedDirector.val()) {   //Director
                            selectedNode.DirectorID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedScheduler.val()) {   //Scheduler
                            selectedNode.SchedulerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedVicePresident.val()) {   //Vice Presdient
                            selectedNode.VicePresidentID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedFinancialAnalyst.val()) {   //Financial Analyst
                            selectedNode.FinancialAnalystID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedCapitalProjectAssistant.val()) {   //Capital Project Assistant
                            selectedNode.CapitalProjectAssistantID = employeeList[x].ID;
                        }
                    }

                    //Validate inputs
                    if (!selectedNode.ProjectName) {	//luan eats
                        dhtmlx.alert('Project Element Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.ProjectClassID) {	//luan eats
                        dhtmlx.alert('Services is a required field.'); 
                        return;
                    }
                    console.log(selectedNode.CostOverheadTypeID, !selectedNode.CostOverheadTypeID);
                    if (!selectedNode.CostOverheadTypeID) {
                        dhtmlx.alert('Labor rate is a required field.');
                        return;
                    }
                    if (!/^\d+$/.test(selectedNode.ProjectElementNumber)) {
                        dhtmlx.alert('Project Element # field is required. Contact your administrator.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!selectedNode.BillingPOC) {
                        dhtmlx.alert('Billing POC is a required field.');
                        return;
                    }
                    //================================ Jignesh-18-02-2021 ====================================
                    if (selectedNode.BillingPOCEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(selectedNode.BillingPOCEmail)) {
                            dhtmlx.alert('Please enter valid Email Address for Billing POC.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //========================================================================================
                    //================================ Jignesh-01-03-2021 ====================================
                    if (selectedNode.BillingPOCPhone1.length > 0) {
                        if (selectedNode.BillingPOCPhone1.length != 12) {
                            dhtmlx.alert('Enter valid 10 Billing POC Phone # 1.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (selectedNode.BillingPOCPhone2.length > 0) {
                        if (selectedNode.BillingPOCPhone2.length != 12) {
                            dhtmlx.alert('Enter valid 10 Billing POC Phone # 2.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //========================================================================================
                    var modifiedName = selectedNode.ProjectName;
                    var modifiedClientPONumber = selectedNode.ClientPONumber;
                    var modifiedAmount = selectedNode.Amount;
                    var modifiedQuickbookJobNumber = selectedNode.QuickbookJobNumber;
                    var modifiedLocationName = selectedNode.LocationName;
                    var modifiedLocation = selectedNode.Location;
                    var modifiedProjectDescription = selectedNode.ProjectDescription;

                    if (modifiedName !== orgName || modifiedClientPONumber !== orgClientPONumber || modifiedQuickbookJobNumber !== orgQuickbookJobNumber ||
                        modifiedAmount !== orgAmount || modifiedProjectDescription !== orgProjectDescription || modifiedLocation !== orgLocation || modifiedLocationName !== orgLocationName)
                        isModified = true;
                    //API to Insert/Update
                    console.log(wbsTree.getScopeToBeDeleted());
                    console.log(selectedNode.ProjectNumber);

                    //Luan here - tbd 10000
                    //-------------------------Swapnil 27/10/2020-----------------------------------------------------
                    if (selectedNode.ProjectManagerID <= 0) {
                        selectedNode.ProjectManagerID = 10000;
                        originalInfo.ProjectManagerID = 10000;
                    }
                    //------------------------------------------------------------------------------------------------
                    if (selectedNode.DirectorID <= 0) {
                        selectedNode.DirectorID = 10000;
                        originalInfo.DirectorID = 10000;
                    }
                    if (selectedNode.SchedulerID <= 0) {
                        selectedNode.SchedulerID = 10000;
                        originalInfo.SchedulerID = 10000;
                    }
                    if (selectedNode.VicePresidentID <= 0) {
                        selectedNode.VicePresidentID = 10000;
                        originalInfo.VicePresidentID = 10000;
                    }
                    if (selectedNode.FinancialAnalystID <= 0) {
                        selectedNode.FinancialAnalystID = 10000;
                        originalInfo.FinancialAnalystID = 10000;
                    }
                    if (selectedNode.CapitalProjectAssistantID <= 0) {
                        selectedNode.CapitalProjectAssistantID = 10000;
                        originalInfo.CapitalProjectAssistantID = 10000;
                    }

                    console.log(selectedNode);

                    //----------------- Swapnil save approvers details 27/10/2020------------------------------------------

                    var approversDetails = [];
                    var employeeList = wbsTree.getEmployeeList();
                    var approversDdl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers select');
                    var approversLbl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers label');
                    for (var i = 0; i < approversDdl.length; i++) {
                        var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                        var EmpId = $('#' + approversDdl[i].id).val();
                        var EmpName = "";
                        for (var x = 0; x < employeeList.length; x++) {
                            if (employeeList[x].ID == $('#' + approversDdl[i].id).val()) {
                                EmpName = employeeList[x].Name;
                                break;
                            }
                        }
                        if (!EmpId) {
                            dhtmlx.alert('Select ' + approversLbl[i].innerText + ' as it is required field.');
                            return;
                        }

                        var approver = {
                            ApproverMatrixId: ApproverMatrixId,
                            EmpId: EmpId,
                            EmpName: EmpName,
                            ProjectElementId: selectedNode.ProjectID
                        };
                        approversDetails.push(approver);
                        console.log(approversDetails);
                    }

                    //--------------------------------------------------------------------------------------

                    var objToSave = {
                        "Operation": 2,
                        "ProjectID": selectedNode.ProjectID,
                        "ProjectName": selectedNode.ProjectName,	//luan eats
                        "ProjectElementName": selectedNode.ProjectName,	//luan eats
                        "ProjectManager": selectedNode.ProjectManager,
                        "ProjectSponsor": selectedNode.ProjectSponsor,
                        "Director": selectedNode.Director,
                        "Scheduler": selectedNode.Scheduler,
                        "ExecSteeringComm": selectedNode.ExecSteeringComm,
                        "VicePresident": selectedNode.VicePresident,
                        "FinancialAnalyst": selectedNode.FinancialAnalyst,
                        //FOr Project Access Control
                        "employeeAllowedList": selectedNode.employeeAllowedList,

                        //luan here
                        "ProjectTypeID": _selectedProgramElement.ProjectTypeID,
                        //"ProjectClassID": _selectedProgramElement.ProjectClassID,
                        "ProjectClassID": selectedNode.ProjectClassID,   //Jignesh 02-12-2020
                       // "ProjectClassID": selectedNode.ServiceClassID,
                        "LocationID": _selectedProgramElement.LocationID,
                        "LineOfBusinessID": selectedNode.LineOfBusinessID,
                        "ClientID": _selectedProgramElement.ClientID,
                        //------------------------------Swapnil 02-09-2020--------------------------------------------------------------------------

                        //"ProjectManagerID": _selectedProgramElement.ProjectManagerID,
                        //"DirectorID": _selectedProgramElement.DirectorID,
                        //"SchedulerID": _selectedProgramElement.SchedulerID,
                        //"VicePresidentID": _selectedProgramElement.VicePresidentID,
                        //"FinancialAnalystID": _selectedProgramElement.FinancialAnalystID,
                        //"CapitalProjectAssistantID": _selectedProgramElement.CapitalProjectAssistantID,

                        "ProjectManagerID": selectedNode.ProjectManagerID,
                        "DirectorID": selectedNode.DirectorID,
                        "SchedulerID": selectedNode.SchedulerID,
                        "VicePresidentID": selectedNode.VicePresidentID,
                        "FinancialAnalystID": selectedNode.FinancialAnalystID,
                        "CapitalProjectAssistantID": selectedNode.CapitalProjectAssistantID,

                        //-------------------------------------------------------------------------------------------------------
                        "LocationID": selectedNode.LocationID,

                        // Biiling POC PRitesh 28jul2020

                        "BillingPOC": selectedNode.BillingPOC,
                        "BillingPOCPhone1": selectedNode.BillingPOCPhone1,
                        "BillingPOCPhone2": selectedNode.BillingPOCPhone2,

                        //====== Jignesh-AddAddressField-21-01-2021 =======
                        //"BillingPOCAddress": selectedNode.BillingPOCAddress,
                        "BillingPOCAddressLine1": selectedNode.BillingPOCAddressLine1,
                        "BillingPOCAddressLine2": selectedNode.BillingPOCAddressLine2,
                        "BillingPOCCity": selectedNode.BillingPOCCity,
                        "BillingPOCState": selectedNode.BillingPOCState,
                        "BillingPOCPONo": selectedNode.BillingPOCPONo,
                        //==================================================
                        "BillingPOCEmail": selectedNode.BillingPOCEmail,
                        "BillingPOCSpecialInstruction": selectedNode.BillingPOCSpecialInstruction,

                        "TMBilling": selectedNode.TMBilling,
                        "SOVBilling": selectedNode.SOVBilling,
                        "MonthlyBilling": selectedNode.MonthlyBilling,
                        "Lumpsum": selectedNode.Lumpsum,
                        "CertifiedPayroll": selectedNode.CertifiedPayroll,


                        "ProjectNumber": _selectedProgramElement.ProjectNumber,
                        "ContractNumber": _selectedProgramElement.ContractNumber,
                        "ProjectStartDate": selectedNode.ProjectStartDate,  //datepicker - project
                        "ContractStartDate": selectedNode.ContractStartDate,		//datepicker - project

                        //project element
                        "ProjectElementNumber": selectedNode.ProjectElementNumber,
                        "ClientPONumber": selectedNode.ClientPONumber,
                        "Amount": selectedNode.Amount,
                        "QuickbookJobNumber": selectedNode.QuickbookJobNumber,
                        "LocationName": selectedNode.LocationName,
                        "Location": selectedNode.Location,
                        "ProjectDescription": selectedNode.ProjectDescription,

                        "CostDescription": _selectedProgramElement.CostDescription,
                        "ScheduleDescription": _selectedProgramElement.ScheduleDescription,
                        "ScopeQualityDescription": _selectedProgramElement.ScopeQualityDescription,

                        "CapitalProjectAssistant": selectedNode.CapitalProjectAssistant,
                        "LatLong": wbsTree.getProjectMap().getCoordinates(),
                        "OrganizationID": wbsTree.getSelectedOrganizationID(),
                        "ProgramElementID": programElementID,
                        "isModified": isModified,
                        "ApproversDetails": approversDetails
                    };

                    wbsTree.getProject().persist().save(objToSave, function (response) {
                        if (response.result == "Duplicate") {
                            dhtmlx.alert('Failed to update. Project element # already exist');
                            return;
                        } else if (response.result.split(',')[0].trim() === "Success") {
                            isFieldValueChanged = false; // Jignesh-31-03-2021
                            originalInfo = objToSave;
                            var docIDs = wbsTree.getDeleteDocIDs();
                            _Document.delByDocIDs()
                                .get({ "docIDs": docIDs.toString() }, function (response) {
                                    console.log(response);
                                    if (response.result == "Deleted") {
                                        wbsTree.setDeleteDocIDs(null);
                                    } else {
                                        dhtmlx.alert('Error trying to delete Uploaded Documents.');
                                    }
                                });

                            //luan whitelist
                            wbsTree.getUpdateProjectWhiteList({ ProjectID: selectedNode.ProjectID }).save(projectWhiteListToSave, function (response) {
                                console.log(response);
                                //window.location.reload();  //Manasi 28-07-2020
                            });

                            //selectedNode.CurrentCost="1111";
                            console.log(selectedNode);
                            selectedNode.name = selectedNode.ProjectElementNumber + ". " + selectedNode.name; // Jignesh-19-03-2021
                            wbsTree.updateTreeNodes(selectedNode);

                            //wbsTree.updateTreeNodes(selectedNode);

                            wbsTree.getWBSTrendTree().trendGraph();
                            wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());
                            $('#ProjectModal').modal('hide');
                        } else {

                            dhtmlx.alert({
                                text: 'Failed to save',
                                width: '500px'
                            });
                            // selectedNode = jQuery.extend({},temp_node);
                            //     selectedNode.name =temp_node.name;
                            //     selectedNode.ProjectManager = temp_node.ProjectManager;
                            //     selectedNode.ProjectSponsor = temp_node.ProjectSponsor;
                            //     selectedNode.Director =  temp_node.Director;
                            //     selectedNode.Scheduler =  temp_node.Scheduler;
                            //     selectedNode.ExecSteeringComm =  temp_node.ExecSteeringComm;
                            //     selectedNode.VicePresident =  temp_node.VicePresident;
                            //     selectedNode.FinancialAnalyst =  temp_node.FinancialAnalyst;
                            //     selectedNode.CapitalProjectAssistant =  temp_node.CapitalProjectAssistant;
                            //     selectedNode.LatLong = temp_node.LatLong;
                            //     wbsTree.setSelectedNode(temp_node);
                        }

                    });

                }


                if (modal_mode == "Create") {   //luan here
                    var newNode = { name: "New Project Element" };

                    console.log(selectedNode);

                    newNode.parent = selectedNode;

                    newNode.name = $('#ProjectModal').find('.modal-body #project_element_name').val();	//luan eats
                    newNode.ProjectName = $('#ProjectModal').find('.modal-body #project_element_name').val();	//luan eats
                    newNode.ProjectManager = $('#ProjectModal').find('.modal-body #project_manager').val();
                    newNode.ProjectSponsor = $('#ProjectModal').find('.modal-body #project_sponsor').val();
                    newNode.Director = $('#ProjectModal').find('.modal-body #director').val();
                    newNode.Scheduler = $('#ProjectModal').find('.modal-body #scheduler').val();
                    newNode.ExecSteeringComm = $('#ProjectModal').find('.modal-body #exec_steering_comm').val();
                    newNode.VicePresident = $('#ProjectModal').find('.modal-body #vice_president').val();
                    newNode.FinancialAnalyst = $('#ProjectModal').find('.modal-body #financial_analyst').val();
                    newNode.CapitalProjectAssistant = $('#ProjectModal').find('.modal-body #capital_project_assistant').val();
                    newNode.CostDescription = $('#ProjectModal').find('.modal-body #cost_description').val();
                    newNode.ScheduleDescription = $('#ProjectModal').find('.modal-body #schedule_description').val();
                    newNode.ScopeQualityDescription = $('#ProjectModal').find('.modal-body #scope_quality_description').val();
                    newNode.LatLong = wbsTree.getProjectMap().getCoordinates();

                    console.log(newNode);

                    //project element
                    newNode.ProjectElementNumber = $('#ProjectModal').find('.modal-body #project_element_number').val();
                    newNode.ClientPONumber = $('#ProjectModal').find('.modal-body #project_element_po_number').val();
                    newNode.Amount = $('#ProjectModal').find('.modal-body #project_element_amount').val();
                    newNode.QuickbookJobNumber = $('#ProjectModal').find('.modal-body #project_element_quickbookJobNumber').val();
                    newNode.LocationName = $('#ProjectModal').find('.modal-body #project_element_locationName').val();
                    newNode.Location = $('#ProjectModal').find('.modal-body #project_element_location').val();
                    newNode.ProjectDescription = $('#ProjectModal').find('.modal-body #project_element_description').val();

                    // Billing POC Pritesh 28jul2020
                    newNode.BillingPOC = $('#ProjectModal').find('.modal-body #program_billing_poc1').val();
                    newNode.BillingPOCPhone1 = $('#ProjectModal').find('.modal-body #program_billing_poc_phone_11').val();
                    newNode.BillingPOCPhone2 = $('#ProjectModal').find('.modal-body #program_billing_poc_phone_21').val();
                    //====== Jignesh-AddAddressField-21-01-2021 =======
                    newNode.BillingPOCAddress = $('#ProjectModal').find('.modal-body #program_billing_poc_address1').val();
                    newNode.BillingPOCAddressLine1 = $('#ProjectModal').find('.modal-body #program1_billing_poc_address_line1').val();
                    newNode.BillingPOCAddressLine2 = $('#ProjectModal').find('.modal-body #program1_billing_poc_address_line2').val();
                    newNode.BillingPOCCity = $('#ProjectModal').find('.modal-body #program1_billing_poc_city').val();
                    newNode.BillingPOCState = $('#ProjectModal').find('.modal-body #program1_billing_poc_state').val();
                    newNode.BillingPOCPONo = $('#ProjectModal').find('.modal-body #program1_billing_poc_po_num').val();
                    //==================================================
                    newNode.BillingPOCEmail = $('#ProjectModal').find('.modal-body #program_billing_poc_email1').val();
                    newNode.BillingPOCSpecialInstruction = $('#ProjectModal').find('.modal-body #program_billing_poc_special_instruction1').val();

                    // Check
                    var program_tm_billing_checked = document.getElementById("program_tm_billing1").checked;
                    var program_sov_billing_checked = document.getElementById("program_sov_billing1").checked;
                    var program_monthly_billing_checked = document.getElementById("program_monthly_billing1").checked;
                    var program_Lumpsum = document.getElementById("program_Lumpsum1").checked;
                    var program_certified_payroll_checked = document.getElementById("program_certified_payroll1").checked;

                    newNode.TMBilling = program_tm_billing_checked ? 1 : 0;
                    newNode.SOVBilling = program_sov_billing_checked ? 1 : 0;
                    newNode.MonthlyBilling = program_monthly_billing_checked ? 1 : 0;
                    newNode.Lumpsum = program_Lumpsum ? 1 : 0;
                    newNode.CertifiedPayroll = program_certified_payroll_checked ? 1 : 0;



                    //luan here
                    newNode.ProjectNumber = $('#ProjectModal').find('.modal-body #project_number').val();
                    newNode.ContractNumber = $('#ProjectModal').find('.modal-body #contract_number').val();
                    newNode.ProjectStartDate = $('#ProjectModal').find('.modal-body #element_start_date').val(); //datepicker - project
                    newNode.ContractStartDate = $('#ProjectModal').find('.modal-body #element_end_date').val();   //datepicker - project

                    //Manasi
                    var selectedLaborRate = $('#ProjectModal').find('modal-body #labor_rate');
                    selectedLaborRate.val(1);  //Manasi
                    for (var x = 0; x < costOverheadTypes.length; x++) {
                        if (costOverheadTypes[x].CostOverHeadType == selectedLaborRate.val()) {
                            selectedNode.CostOverheadTypeID = costOverheadTypes[x].ID;
                        }
                    }
                    console.log(selectedLaborRate);


                    //luan here - Find the project type id
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var selectedProjectType = $('#ProjectModal').find('.modal-body #project_type');
                    newNode.ProjectTypeID = 0;
                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == selectedProjectType.val()) {
                            newNode.ProjectTypeID = projectTypeList[x].ProjectTypeID;
                        }
                    }

                    //luan here - Find the project class id
                    var projectClassList = wbsTree.getProjectClassList();
                    var selectedProjectClass = $('#ProjectModal').find('.modal-body #project_element_class');
                    console.log(selectedProjectClass, selectedProjectClass.val());
                    newNode.ProjectClassID = 0;
                    for (var x = 0; x < projectClassList.length; x++) {
                        console.log(projectClassList[x].ProjectClassName, selectedProjectClass.val());
                        if (projectClassList[x].ProjectClassName == selectedProjectClass.val()) {
                            //newNode.ProjectClassID = projectClassList[x].ProjectClassID;
                        }
                    }
                    //Added by vaishnavi

                    var serviceClassList = wbsTree.getServiceClassList();
                    var selectedServiceClass = $('#ProjectModal').find('.modal-body #service_class');
                    console.log(selectedServiceClass, selectedServiceClass.val());
                    newNode.ProjectClassID = 0;
                    for (var x = 0; x < serviceClassList.length; x++) {
                        console.log(serviceClassList[x].Description, selectedServiceClass.val());
                        if (serviceClassList[x].Description.trim() == selectedServiceClass.val()) {
                            newNode.ProjectClassID = serviceClassList[x].ID;
                        }
                    }

                    //luan here - Find the client id
                    var clientList = wbsTree.getClientList();
                    var selectedClient = $('#ProjectModal').find('.modal-body #client');
                    console.log(selectedClient, selectedClient.val());
                    newNode.ClientID = 0;
                    for (var x = 0; x < clientList.length; x++) {
                        console.log(clientList[x].ClientName, selectedClient.val());
                        if (clientList[x].ClientName == selectedClient.val()) {
                            newNode.ClientID = clientList[x].ClientID;
                        }
                    }

                    var locationList = wbsTree.getLocationList();
                    var selectedLocation = $('#ProjectModal').find('.modal-body #project_element_location');
                    console.log(selectedLocation, selectedLocation.val());
                    newNode.LocationID = 0;
                    //for (var x = 0; x < locationList.length; x++) {
                    //    console.log(locationList[x].LocationName, selectedLocation.val());
                    //    if (locationList[x].LocationName == selectedLocation.val()) {
                    //        newNode.LocationID = locationList[x].LocationID;
                    //    }
                    //}
                    newNode.LocationID = locationList[0].LocationID;

                    //changed by vaishnavi
                    //var request = {
                    //    method: 'GET',
                    //    url: serviceBasePath + 'Request/ServiceClass',
                    //    // data: formdata, //fileUploadProject.files, //$scope.
                    //    ignore: true,
                    //    headers: {
                    //        'Content-Type': undefined
                    //    }
                    //};
                    //var serviceClassList;
                    //var 
                    //var angularhttp = wbsTree.getAngularHttp();
                    //angularhttp(request).then(function (response) {
                    //    serviceClassList = response.data.result;
                    //    var selectedProjectClass = $('#ProjectModal').find('.modal-body #service_class');
                    //    //console.log(selectedprojectclass, selectedprojectclass.val());
                    //    newNode.ProjectClassID = 0;
                    //    for (var x = 0; x < serviceClassList.length; x++) {
                    //        // console.log(projectClassList[x].Description, selectedProjectClass.val());
                    //        //projectClassList[x].Description.trim();
                    //        if (serviceClassList[x].Description.trim() == selectedProjectClass.val()) {
                    //            newNode.ProjectClassID = serviceClassList[x].ID.toString();
                    //        }
                    //    }
                    //});
                    //newNode.ProjectClassID = "7";
                    //luan here - Find the employees id
                    var employeeList = wbsTree.getEmployeeList();
                    //--------------------------------------- Swapnil 03-09-2020 --------------------------------------

                    //var selectedProjectManager = modal.find('.modal-body #project_manager_id');
                    //var selectedDirector = modal.find('.modal-body #director_id');
                    //var selectedScheduler = modal.find('.modal-body #scheduler_id');
                    //var selectedVicePresident = modal.find('.modal-body #vice_president_id');
                    //var selectedFinancialAnalyst = modal.find('.modal-body #financial_analyst_id');
                    //var selectedCapitalProjectAssistant = modal.find('.modal-body #capital_project_assistant_id');

                    var selectedProjectManager = $('#ProjectModal').find('.modal-body #project_element_project_manager_id');
                    var selectedDirector = $('#ProjectModal').find('.modal-body #project_element_director_id');
                    var selectedScheduler = $('#ProjectModal').find('.modal-body #project_element_scheduler_id');
                    var selectedVicePresident = $('#ProjectModal').find('.modal-body #project_element_vice_president_id');
                    var selectedFinancialAnalyst = $('#ProjectModal').find('.modal-body #project_element_financial_analyst_id');
                    var selectedCapitalProjectAssistant = $('#ProjectModal').find('.modal-body #project_element_capital_project_assistant_id');

                    //-----------------------------------------------------------------------------------------------------
                    var selectedLaborRate = modal.find('.modal-body #labor_rate_id');
                    var selectedLob = modal.find('.modal-body #project_lob');
                    newNode.ProjectManagerID = 0;
                    newNode.DirectorID = 0;
                    newNode.SchedulerID = 0;
                    newNode.VicePresidentID = 0;
                    newNode.FinancialAnalystID = 0;
                    newNode.CapitalProjectAssistantID = 0;
                    //newNode.CostOverheadTypeID = 0;
                    newNode.CostOverheadTypeID = 1;   //Manasi
                    newNode.LineOfBusinessID = 0;

                    lobList = wbsTree.getLineOfBusinessList();
                    for (var x = 0; x < lobList.length; x++) {
                        if (lobList[x].LOBName == selectedLob.val()) {
                            newNode.LineOfBusinessID = lobList[x].ID;
                        }
                    }
                    //for (var x = 0; x < costOverheadTypes.length; x++) {
                    //    if (costOverheadTypes[x].CostOverHeadType == selectedLaborRate.val()) {
                    //        newNode.CostOverheadTypeID = costOverheadTypes[x].ID;
                    //    }
                    //}
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == selectedProjectManager.val()) {   //Project Manager
                            newNode.ProjectManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedDirector.val()) {   //Director
                            newNode.DirectorID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedScheduler.val()) {   //Scheduler
                            newNode.SchedulerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedVicePresident.val()) {   //Vice Presdient
                            newNode.VicePresidentID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedFinancialAnalyst.val()) {   //Financial Analyst
                            newNode.FinancialAnalystID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == selectedCapitalProjectAssistant.val()) {   //Capital Project Assistant
                            newNode.CapitalProjectAssistantID = employeeList[x].ID;
                        }
                    }

                    //Validate inputs
                    if (!newNode.name) {
                        //dhtmlx.alert('Project element name is a required field 2.');
                        dhtmlx.alert('Project Element Name is a required field.'); // Jignesh-02-03-2021
                        return;
                    }
                    if (!newNode.ProjectClassID) {
                        //dhtmlx.alert('Project element name is a required field 2.');
                        dhtmlx.alert('Services is a required field.');
                        return;
                    }

                    //if (!/^\d+$/.test(newNode.ProjectElementNumber)) {
                    //    dhtmlx.alert('Project element # field is required. Contact your administrator.');
                    //    return;
                    //}

                    if (!newNode.BillingPOC) {
                        dhtmlx.alert('Billing POC is a required field');
                        return;
                    }

                    //================================ Jignesh-18-02-2021 ====================================
                    if (newNode.BillingPOCEmail.length > 0) {
                        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
                        if (!testEmail.test(newNode.BillingPOCEmail)) {
                            dhtmlx.alert('Please enter valid Email Address for Billing POC.'); // Jignesh-02-03-2021
                            return;
                        }
                    }
                    //========================================================================================
                    //================================ Jignesh-01-03-2021 ====================================
                    if (newNode.BillingPOCPhone1.length > 0) {
                        if (newNode.BillingPOCPhone1.length != 12) {
                            dhtmlx.alert('Enter valid 10 Billing POC Phone # 1.'); //Jignesh-02-03-2021
                            return;
                        }
                    }
                    if (newNode.BillingPOCPhone2.length > 0) {
                        if (newNode.BillingPOCPhone2.length != 12) {
                            dhtmlx.alert('Enter valid 10 Billing POC Phone # 2.'); //Jignesh-02-03-2021
                            return;
                        }
                    }
                    //========================================================================================

                    newNode.level = "Project";
                    newNode.CurrentCost = 0;
                    newNode.CurrentStartDate = "N/A";

                    selectedNode = newNode;
                    //Get project scope

                    console.log(selectedNode);

                    //Luan here - tbd 10000
                    if (selectedNode.DirectorID <= 0) selectedNode.DirectorID = 10000;
                    if (selectedNode.SchedulerID <= 0) selectedNode.SchedulerID = 10000;
                    if (selectedNode.VicePresidentID <= 0) selectedNode.VicePresidentID = 10000;
                    if (selectedNode.FinancialAnalystID <= 0) selectedNode.FinancialAnalystID = 10000;
                    if (selectedNode.CapitalProjectAssistantID <= 0) selectedNode.CapitalProjectAssistantID = 10000;

                    //----------------- Swapnil save approvers details 27/10/2020------------------------------------------

                    var approversDetails = [];
                    var employeeList = wbsTree.getEmployeeList();
                    var approversDdl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers select');
                    var approversLbl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers label');
                    for (var i = 0; i < approversDdl.length; i++) {
                        var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                        var EmpId = $('#' + approversDdl[i].id).val();
                        var EmpName = "";
                        for (var x = 0; x < employeeList.length; x++) {
                            if (employeeList[x].ID == $('#' + approversDdl[i].id).val()) {
                                EmpName = employeeList[x].Name;
                                break;
                            }
                        }
                        if (!EmpId) {
                            dhtmlx.alert('Select ' + approversLbl[i].innerText + ' as it is required field.');
                            return;
                        }

                        var approver = {
                            ApproverMatrixId: ApproverMatrixId,
                            EmpId: EmpId,
                            EmpName: EmpName,
                            ProjectElementId: 0
                        };
                        approversDetails.push(approver);
                        console.log(approversDetails);
                    }

                    //--------------------------------------------------------------------------------------

                    //API to Insert Project
                    var objToSave = {

                        "Operation": 1,
                        "ProgramID": _selectedProgramElement.ProgramID,
                        "ProgramElementID": _selectedProgramElement.ProgramElementID,
                        "ProjectName": selectedNode.ProjectName,	//luan eats
                        "ProjectElementName": selectedNode.ProjectName,	//luan eats
                        "ProjectManager": selectedNode.ProjectManager,
                        "ProjectSponsor": selectedNode.ProjectSponsor,
                        "Director": selectedNode.Director,
                        "Scheduler": selectedNode.Scheduler,
                        "ExecSteeringComm": selectedNode.ExecSteeringComm,
                        "VicePresident": selectedNode.VicePresident,
                        "FinancialAnalyst": selectedNode.FinancialAnalyst,

                        // Pritesh Billing POC 
                        "BillingPOC": newNode.BillingPOC,
                        "BillingPOCPhone1": newNode.BillingPOCPhone1,
                        "BillingPOCPhone2": newNode.BillingPOCPhone2,
                        //====== Jignesh-AddAddressField-21-01-2021 =======
                        //"BillingPOCAddress": newNode.BillingPOCAddress,
                        "BillingPOCAddressLine1": newNode.BillingPOCAddressLine1,
                        "BillingPOCAddressLine2": newNode.BillingPOCAddressLine2,
                        "BillingPOCCity": newNode.BillingPOCCity,
                        "BillingPOCState": newNode.BillingPOCState,
                        "BillingPOCPONo": newNode.BillingPOCPONo,
                        //==================================================
                        "BillingPOCEmail": newNode.BillingPOCEmail,
                        "BillingPOCSpecialInstruction": newNode.BillingPOCSpecialInstruction,

                        "TMBilling": newNode.TMBilling,
                        "SOVBilling": newNode.SOVBilling,
                        "MonthlyBilling": newNode.MonthlyBilling,
                        "Lumpsum": newNode.Lumpsum,
                        "CertifiedPayroll": newNode.CertifiedPayroll,


                        //luan here
                        "ProjectTypeID": _selectedProgramElement.ProjectTypeID,
                        "ProjectClassID": selectedNode.ProjectClassID,
                       //"ProjectClassID": selectedNode.ServiceClassID,
                        "LocationID": selectedNode.LocationID,

                        //------------------------ Swapnil 03-09-2020 ----------------------------------------------------
                        //"ClientID": _selectedProgramElement.ClientID,
                        //"ProjectManagerID": _selectedProgramElement.ProjectManagerID,
                        //"DirectorID": _selectedProgramElement.DirectorID,
                        //"SchedulerID": _selectedProgramElement.SchedulerID,
                        //"VicePresidentID": _selectedProgramElement.VicePresidentID,
                        //"FinancialAnalystID": _selectedProgramElement.FinancialAnalystID,
                        //"CapitalProjectAssistantID": _selectedProgramElement.CapitalProjectAssistantID,

                        "ClientID": _selectedProgramElement.ClientID,

                        "ProjectManagerID": newNode.ProjectManagerID,
                        "DirectorID": newNode.DirectorID,
                        "SchedulerID": newNode.SchedulerID,
                        "VicePresidentID": newNode.VicePresidentID,
                        "FinancialAnalystID": newNode.FinancialAnalystID,
                        "CapitalProjectAssistantID": newNode.CapitalProjectAssistantID,

                        //--------------------------------------------------------------------------------------------

                        //project element
                        "ProjectElementNumber": selectedNode.ProjectElementNumber,
                        "ClientPONumber": selectedNode.ClientPONumber,
                        "Amount": selectedNode.Amount,
                        "QuickbookJobNumber": selectedNode.QuickbookJobNumber,
                        "LocationName": selectedNode.LocationName,
                        "Location": selectedNode.Location,
                        "ProjectDescription": selectedNode.ProjectDescription,

                        "ProjectNumber": _selectedProgramElement.ProjectNumber,
                        "ContractNumber": _selectedProgramElement.ContractNumber,
                        "ProjectStartDate": selectedNode.ProjectStartDate,	//datepicker - project
                        "ContractStartDate": selectedNode.ContractStartDate,    //datepicker - project

                        "CostDescription": _selectedProgramElement.CostDescription,
                        "ScheduleDescription": _selectedProgramElement.ScheduleDescription,
                        "ScopeQualityDescription": _selectedProgramElement.ScopeQualityDescription,

                        "CapitalProjectAssistant": selectedNode.CapitalProjectAssistant,
                        "LatLong": wbsTree.getProjectMap().getCoordinates(),
                        "OrganizationID": wbsTree.getSelectedOrganizationID(),
                        "LineOfBusinessID": selectedNode.LineOfBusinessID,
                        "ApproversDetails": approversDetails

                    };

                    //return;

                    wbsTree.getProject().persist().save(objToSave, function (response) {
                        if (response.result == "Duplicate") {
                            dhtmlx.alert('Failed to update. Project element # already exist');
                            return;
                        }
                        console.log("-------ADDING A PROJECT-------");
                        if (response.result.split(',')[0].trim() === "Success") {
                            isFieldValueChanged = false; // Jignesh-31-03-2021
                            console.log(response.result.split(','));

                            for (var x = 0; x < projectWhiteListToSave.length; x++) {
                                projectWhiteListToSave[x].ProjectID = response.result.split(',')[3].trim();
                            }

                            //luan whitelist
                            wbsTree.getUpdateProjectWhiteList({ ProjectID: selectedNode.ProjectID }).save(projectWhiteListToSave, function (response) {
                                console.log(response);
                            });

                            //   wbsTree.setScopeToBeAdded(listToSave);
                            var resultArray = response.result.split(',');
                            newNode.ProgramID = resultArray[1];
                            newNode.ProgramElementID = resultArray[2];
                            newNode.ProjectID = resultArray[3];
                            newNode.name = response.result.split(',')[4].trim() + ". " + newNode.name; // Jignesh-19-03-2021

                            var index = 0;

                            var apiUpload = function () {
                                if (index >= wbsTree.getProjectFileDraft().length) {
                                    return;
                                }

                                docTypeID = wbsTree.getProjectFileDraft()[index].docTypeID;
                                formdata = wbsTree.getProjectFileDraft()[index].formdata;

                                var request = {
                                    method: 'POST',
                                    url: serviceBasePath + '/uploadFiles/Post/Project/' + newNode.ProjectID + '/0/0/0/0/' + docTypeID,
                                    data: formdata, //fileUploadProject.files, //$scope.
                                    ignore: true,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                };

                                var angularHttp = wbsTree.getAngularHttp();
                                angularHttp(request).then(function success(d) {
                                    index++;
                                    apiUpload();
                                });
                            }

                            apiUpload();




                            //Saving drafted 
                            var objToSave = {};
                            var listToSave = [];
                            for (var x = 0; x < g_project_element_milestone_draft_list.length; x++) {
                                g_project_element_milestone_draft_list[x].ProjectID = newNode.ProjectID;
                                objToSave = g_project_element_milestone_draft_list[x];
                                objToSave.Operation = 1;
                                listToSave.push(objToSave);
                            }

                            var apiRegisterProjectElementMilestone = function () {
                                wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave,
                                    function (response) {
                                        if (response.result) {
                                            if (response.result.split(',')[0].trim() === "Success") {
                                                g_project_element_milestone_draft_list = [];
                                                console.log('project element milestone saved successfully');
                                            } else {
                                                //dhtmlx.alert({ text: response.result, width: '500px' });
                                                $('#ProjectElementMilestoneModal').modal('hide');
                                                $("#ProjectModal").css({ "opacity": "1" });
                                            }
                                            populateProjectElementMilestoneTable(newNode.ProjectID);
                                        }
                                    });
                            }

                            apiRegisterProjectElementMilestone();



                            $('#ProjectModal').modal('hide');

                            selectedNode = selectedNode.parent;
                            //selectedNode.projectScopes = listToSave;
                            if (!selectedNode._children && !selectedNode.children) {//Empty parent
                                selectedNode._children = [newNode];
                                selectedNode = toggleChildren(selectedNode);
                            }
                            else if (selectedNode._children) { //Parent is collapsed
                                selectedNode._children.push(newNode);
                                selectedNode = toggleChildren(selectedNode);
                            }
                            else if (selectedNode.children) { //Parent is expanded
                                selectedNode.children.push(newNode);

                            }
                            wbsTree.updateTreeNodes(selectedNode);
                            var selectedProjectID = resultArray[3];
                            wbsTree.setSelectedProjectID(selectedProjectID);
                            var projectNumber = parseInt(resultArray[4]);
                            wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());
                            //---------- task 2184  swapnil 25/01/2021 ---------------------------------------

                            if (projectNumber == 1) {
                                wbsTree.getWBSTrendTree().trendGraph(true);
                            }

                            //-----------------------------------------------------------------------

                            //Parameterize JSON
                            var toUpdateTrend = {
                                "Operation": "1",
                                "ProjectID": selectedProjectID,
                                "TrendNumber": "0",
                                "TrendDescription": "Baseline",
                                "TrendStatusID": 3,
                                "TrendJustification": "",
                                "TrendImpact": "",
                                "TrendImpactSchedule": "",
                                "TrendImpactCostSchedule": "",
                                "CreatedOn": getTodayAsString(),
                                "CostOverheadTypeID": newNode.CostOverheadTypeID
                            };
                            console.log(toUpdateTrend);
                            wbsTree.getTrend().persist().save(toUpdateTrend, function (response) {
                                wbsTree.getWBSTrendTree().trendGraph();
                                //window.location.reload();  //Manasi 28-07-2020
                            });

                        } else {

                            //dhtmlx.alert({
                            //    text: 'Failed to save',
                            //    width: '500px'
                            //});
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                        }
                    });

                    wbsTree.updateTreeNodes(selectedNode);
                    wbsTree.getWBSTrendTree().trendGraph();
                    wbsTree.getProjectMap().initProjectMap(selectedNode, wbsTree.getOrganizationList());

                    //var uploadBtnProject = modal.find('.modal-body #uploadBtnProject');
                    //uploadBtnProject.attr('disabled', false);
                }
            });

            //Root Modal
            $('#RootModal').on('show.bs.modal', function (event) {
                defaultModalPosition();
                var selectedNode = wbsTree.getSelectedNode();
                modal = $(this);

                modal.find('.modal-title').text(selectedNode.name);
                modal_mode = "Create";

            });
            //Project-scope
            $("#ProjectScopeModal").unbind().on('show.bs.modal', function (event) {
                defaultModalPosition();
                modal = $(this);
                //wbsTree.setDescriptionList([]);

                var clickedID;
                $('[data-submenu]').submenupicker();
                var scopeTobeAdded = [];
                var scopeToBeDeleted = wbsTree.getScopeToBeDeleted();

                var selectedNode = wbsTree.getSelectedNode();
                modal.find('.modal-title').text('Project : ' + selectedNode.name);

                var scopeTable = $("#scopeTable").find('.scope');

                //disable text area if no row is selected

                console.log(selectedNode);
                appendScopeTable(selectedNode, scopeTable);
                var descriptionList = wbsTree.getDescriptionList();
                console.log(descriptionList);
                var rows = $(scopeTable).find('tr');
                console.log(rows);
                $.each(rows, function (item) {
                    console.log($(this).hasClass("highlight"));
                    if (!$(this).hasClass("highlight")) {
                        $("#textInput").attr("disabled", true);
                    }
                })
                jQuery.each(jQuery('textarea[data-autoresize]'), function () {
                    var offset = this.offsetHeight - this.clientHeight;
                    var resizeTextarea = function (el) {
                        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
                    };
                    jQuery(this).on('keyup input', function () { resizeTextarea(this); }).removeAttr('data-autoresize');
                });
                //delete a row
                $("table.scope").unbind('click').on('click', ' .deleteRow', function (e) {

                    // var index ;
                    var row = $(this).closest('tr');
                    var rowData = $(row).find('td');
                    var scopeToBeDeleted = [];

                    scopeToBeDeleted = wbsTree.getScopeToBeDeleted();

                    var index = $(this).closest('tr').prevAll().length;

                    console.log(rowData);
                    $.each(rowData, function () {
                        console.debug("THIS", $(this).text());
                    })
                    console.log();
                    var obj = {};
                    obj.Area = $($(rowData[1]).find('#dropLabel')).text();
                    obj.ImpactType = $($(rowData[2]).find('#impactLabel')).text();
                    obj.Description = $($(rowData[3]).find('textarea')).val();
                    obj.ProjectID = selectedNode.ProjectID;
                    obj.isNew = $(rowData[5]).text();
                    obj.Id = $(rowData[6]).text();
                    //obj.description
                    scopeToBeDeleted.push(obj);
                    console.log(scopeToBeDeleted);
                    //$("#textInput").val("");
                    descriptionList.splice(index, 1);
                    wbsTree.setScopeToBeDeleted(scopeToBeDeleted);
                    // var valueToAddBack = rowData[2].textContent;
                    //   var fName = rowData[1].textContent;
                    if ($(row).hasClass("highlight")) {
                        $("#textInput").val("");
                        $("#textInput").attr("disabled", true);
                    }
                    row.remove();

                });
                //To show description of the scope
                $("table.scope").on('click', ' tbody tr #infoRow', function () {
                    var row = $(this).closest('tr');
                    clickedID = $(this).closest('tr').prevAll().length;
                    $(row).addClass('highlight').siblings().removeClass('highlight');
                    $("#textInput").attr("disabled", false);
                    $("#textInput").val(descriptionList[clickedID]);
                });
                $("#textInput").on('keyup', function () {
                    descriptionList[clickedID] = $(this).val();
                    console.log($(this).val());
                    wbsTree.setDescriptionList(descriptionList);
                });
                $("table.scope").on('click', ' tbody tr #hello li a', function () {
                    //  $(this).addClass('highlight').siblings().removeClass('highlight');
                    var row = $(this).closest('tr');
                    // $(row).addClass('highlight').siblings().removeClass('highlight');
                    var rowData = row.find('td');
                    var first = $(rowData[1]).find('#dropLabel');
                    var second = $(rowData[2]).find("#asset");
                    console.log(first.text());
                    switch ($(this).text().trim()) {
                        case "Network":
                            networkList(second);
                            break;
                        case "Operating System":
                            databaseList(second);
                            break;
                        case "Database":
                            databaseList(second);
                            break;
                        case "Application":
                            applicationList(second);
                            break;
                        case "Host":
                            hostList(second);
                            break;
                        case "End Devices":
                            endDeviceList(second);
                            break;
                        case "Select Layer":
                            break;
                        default: networkList(second);;

                    }
                    first.text($(this).text());
                    var second = $(rowData[2]);
                });

                //console.log($(tableData).height());
                //console.log($(tableData).hasClass('open'));


                $("table.scope").on('click', ' tbody tr #asset li a', function () {
                    //   $(this).addClass('highlight').siblings().removeClass('highlight');
                    var row = $(this).closest('tr');
                    var rowData = row.find('td');
                    var first = $(rowData[2]).find('#assetLabel');
                    console.log(first.text());
                    first.text($(this).text());
                    var second = $(rowData[2]);

                });

                $("table.scope").on('click', ' tbody tr #impact li a', function () {
                    //   $(this).addClass('highlight').siblings().removeClass('highlight');
                    var row = $(this).closest('tr');
                    var rowData = row.find('td');
                    var first = $(rowData[3]).find('#impactLabel');
                    console.log(first.text());
                    first.text($(this).text());
                    var second = $(rowData[3]);

                });

                $("#addScope").unbind('click').on('click', function () {
                    var id = scopeTable.find("tr").length;
                    //    $(row).addClass('highlight').siblings().removeClass('highlight');
                    scopeTable.append($('<tr class="clickRowScope ">')
                        .append(
                            $('<td  id="infoRow"  style="width:5%;">').append($('<span class="fa fa-info-circle"   style="width:100%;color:black !important; font-size:20px;">')),
                            $('<td scope="col" style="text-align:center;position: relative; width: 30%; vertical-align: middle">').
                                append($('<div class="dropdown scope-dropdown">').
                                    append(
                                        $(' <a style="color :#337ab7 !important; " tabindex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">').
                                            append(' <label id="dropLabel" style="margin-right:5px;">Select Layer</label><span class="caret"></span>'),
                                        $('<ul class="dropdown-menu" id="hello">').append(
                                            //$('<li>').append('<a tabindex="0" >Facility</a>'),
                                            $('<li class="dropdown-submenu">').append(
                                                $('<a tabindex="0">Facilities</a>'),
                                                $('<ul class="dropdown-menu">').append(
                                                    $('<li>').append('<a tabindex="0">Cleveland Tower</a>'),
                                                    $('<li>').append('<a tabindex="0">Charleston Tower</a>'),
                                                    $('<li>').append('<a tabindex="0">Baton Rouge Tower</a>'),
                                                    $('<li>').append('<a tabindex="0">Bangor Tower</a>'),
                                                    $('<li>').append('<a tabindex="0">Wilkes-Barre Tower</a>'),
                                                    $('<li>').append('<a tabindex="0">Bakersfield Tower</a>')
                                                )
                                            ),
                                            $('<li class="dropdown-submenu">').append(
                                                $('<a tabindex="0">System </a>'),
                                                $('<ul class="dropdown-menu">').append(
                                                    $('<li>').append('<a tabindex="0">Network</a>'),
                                                    $('<li>').append('<a tabindex="0">Operating System</a>'),
                                                    $('<li>').append('<a tabindex="0">Database</a>'),
                                                    $('<li>').append('<a tabindex="0">Application</a>'),
                                                    $('<li>').append('<a tabindex="0">Host</a>'),
                                                    $('<li>').append('<a tabindex="0"> End Devices </a>')
                                                )
                                            ),
                                            $('<li>').append('<a tabindex="0">Infrastructure</a>'),
                                            $('<li>').append('<a tabindex="0">Opeartion</a>')
                                        )

                                    )
                                ),
                            $('<td scope="col" style="text-align:center;position: relative; width: 30%; vertical-align: middle">').
                                append($('<div class="dropdown scope-dropdown"  >').
                                    append(
                                        $(' <a style="color :#337ab7 !important; " tabindex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">').
                                            append(
                                                $(' <label id="assetLabel" style="margin-right:5px;"></label>').text("Select Asset"),
                                                $('<span class="caret"></span>')
                                            ),
                                        $('<ul class="dropdown-menu" id="asset" style="height:250px;overflow-y:scroll">').append(
                                            //$('<li>').append('<a tabindex="0" >Facility</a>'),
                                            //$('<li>').append('<a tabindex="0";>Academic</a>'),
                                            //$('<li>').append('<a tabindex="0";>Internal</a>'),
                                            //$('<li>').append('<a tabindex="0">External</a>'),
                                            //$('<li>').append('<a tabindex="0">Financial</a>')
                                        )

                                    )
                                ),
                            $('<td scope="col" style="text-align:center;position: relative; width: 30%; vertical-align: middle">').
                                append($('<div class="dropdown scope-dropdown">').
                                    append(
                                        $(' <a style="color :#337ab7 !important; " tabindex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">').
                                            append(
                                                $(' <label id="impactLabel" style="margin-right:5px;"></label>').text("Select Impact"),
                                                $('<span class="caret"></span>')
                                            ),
                                        $('<ul class="dropdown-menu" id="impact">').append(
                                            //$('<li>').append('<a tabindex="0" >Facility</a>'),
                                            $('<li>').append('<a tabindex="0";>New</a>'),
                                            $('<li>').append('<a tabindex="0";>Replacement</a>'),
                                            $('<li>').append('<a tabindex="0">Moveout Changes</a>')

                                        )

                                    )
                                ),
                            $('<td  class="deleteRow"  style="width:5%;">').append($('<span class="fa fa-trash"   style="width:100%">')),
                            $('<td scope="col" style="display:none;">true</td>'),
                            $('<td scope="col" style="display:none"></td>').text("")
                        )
                    );
                    $('[data-submenu]').submenupicker();
                    var obj = {
                        area: "",
                        description: "",
                        impactType: "",
                        isNew: true
                    }
                    console.log(obj);

                    scopeTobeAdded.push(obj);
                    jQuery.each(jQuery('textarea[data-autoresize]'), function () {
                        var offset = this.offsetHeight - this.clientHeight;
                        var resizeTextarea = function (el) {
                            jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
                        };
                        jQuery(this).on('keyup input', function () { resizeTextarea(this); }).removeAttr('data-autoresize');
                    });

                });
            });
            $("#ProjectScopeModal").on("hide.bs.modal", function () {

                $('#scopeTable .scope tbody').empty();
                //$("#addScope").unbind('click');
                // wbsTree.updateTreeNodes(selectedNode);
            });
            //Program Modal
            function fillPhaseList(phaseCodeList) {
                $('#phaseSelect').empty();
                $.each(phaseCodeList, function (key, value) {
                    $('#phaseSelect').append($('<option></option>').val(value.PhaseID).html(value.PhaseDescription));
                });
            }
            function fillMainCategoryList(mainCategoryList) {
                $('#mainBudgetSelect').empty();
                $.each(mainCategoryList, function (key, value) {
                    $('#mainBudgetSelect').append($('<option></option>').val(value.CategoryID).html(value.CategoryDescription));
                });
            }
            function fillFundList(fundList) {
                $('#fundSelect').empty();
                if (fundList != null) {
                    $.each(fundList, function (key, value) {
                        $('#fundSelect').append($('<option></option>').val(value.FundTypeId).html(value.Fund));
                    });
                }

            }

            function fillSubCategoryList(subCategoryList) {

            }

            function getSubBudgetCategory() {
                var mainCategoryId = $('#mainBudgetSelect').val();

                phaseId = $('#phaseSelect').val();
                phaseId = phaseId * 1000;

            };


            //===================================================================================== PROJECT ELEMENT MILESTONE START ===================================================================
            // UPDATE PROJECT ELEMENT MILESTONE MODAL LEGACY
            $('#update_project_element_milestone_modal').unbind('click').on('click', function () {

                var MileStoneTile = modal.find('.modal-body #project_element_milestone_name_modal').val();
                var MilestoneDescp = modal.find('.modal-body #project_element_milestone_description_modal').val();
                var MilestoneDate = modal.find('.modal-body #project_element_milestone_date_modal').val();

                if (MileStoneTile == "" || MileStoneTile.length == 0) {
                    //dhtmlx.alert('Enter Tile.');
                    dhtmlx.alert('Enter Title.');  //Manasi
                    return;
                }
                if (MilestoneDescp == "" || MilestoneDescp.length == 0) {
                    dhtmlx.alert('Enter Description.');
                    return;
                }
                if (MilestoneDate == "" || MilestoneDate.length == 0) {
                    dhtmlx.alert('Enter Date.');
                    return;
                }

                console.log(g_newProjectElementMilestone);

                if (!g_newProjectElementMilestone) {   //Update
                    var updatedMilestone = g_selectedProjectElementMilestone;
                    var isModified = true;

                    updatedMilestone.MilestoneName = modal.find('.modal-body #project_element_milestone_name_modal').val();
                    updatedMilestone.MilestoneDescription = modal.find('.modal-body #project_element_milestone_description_modal').val();
                    updatedMilestone.MilestoneDate = modal.find('.modal-body #project_element_milestone_date_modal').val();

                    if (g_newProject) {
                        //Find the one in the draft list
                        for (var x = 0; x < g_project_element_milestone_draft_list.length; x++) {
                            if (g_project_element_milestone_draft_list[x].MilestoneName == g_selectedProjectElementMilestone.MilestoneName
                                && g_project_element_milestone_draft_list[x].MilestoneDescription == g_selectedProjectElementMilestone.MilestoneDescription
                                && g_project_element_milestone_draft_list[x].MilestoneDate == g_selectedProjectElementMilestone.MilestoneDate) {
                                g_project_element_milestone_draft_list[x].MilestoneName = updatedMilestone.MilestoneName;
                                g_project_element_milestone_draft_list[x].MilestoneDescription = updatedMilestone.MilestoneDescription;
                                g_project_element_milestone_draft_list[x].MilestoneDate = updatedMilestone.MilestoneDate;
                            }
                        }
                        populateProjectElementMilestoneTableNew();
                        $('#ProjectElementMilestoneModal').modal('hide');
                        $("#ProjectModal").css({ "opacity": "1" });
                        return;
                    }

                    var obj = {
                        "Operation": 2,
                        "MilestoneID": updatedMilestone.MilestoneID,
                        "MilestoneName": updatedMilestone.MilestoneName,
                        "MilestoneDescription": updatedMilestone.MilestoneDescription,
                        "MilestoneDate": updatedMilestone.MilestoneDate,
                        "ProgramElementID": 0,
                        "ProjectID": wbsTree.getSelectedProjectID(),
                    }

                    var listToSave = [];
                    listToSave.push(obj);

                    //API to Insert/Update
                    wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave, function (response) {
                        if (response.result.split(',')[0].trim() === "Success") {
                            //$('#ProgramModal').modal('hide');
                        } else {
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                        }

                        $('#ProjectElementMilestoneModal').modal('hide');
                        $("#ProjectModal").css({ "opacity": "1" });
                        populateProjectElementMilestoneTable(wbsTree.getSelectedProjectID());

                        g_selectedProjectElementMilestone = null; 	//Manasi
                    });
                }

                if (g_newProjectElementMilestone) {
                    var newNode = { name: "New Project Element Milestone" };
                    var newMilestone = {};

                    newMilestone.MilestoneName = modal.find('.modal-body #project_element_milestone_name_modal').val();
                    newMilestone.MilestoneDescription = modal.find('.modal-body #project_element_milestone_description_modal').val();
                    newMilestone.MilestoneDate = modal.find('.modal-body #project_element_milestone_date_modal').val();

                    var obj = {
                        "Operation": 1,
                        "MilestoneName": newMilestone.MilestoneName,
                        "MilestoneDescription": newMilestone.MilestoneDescription,
                        "MilestoneDate": newMilestone.MilestoneDate,
                        "ProgramElementID": 0,
                        "ProjectID": wbsTree.getSelectedProjectID(),
                    }

                    var listToSave = [];
                    listToSave.push(obj);

                    if (g_newProject) {
                        //alert(g_project_element_milestone_draft_list); //
                        g_project_element_milestone_draft_list.push({
                            "Operation": 1,
                            "MilestoneName": newMilestone.MilestoneName,
                            "MilestoneDescription": newMilestone.MilestoneDescription,
                            "MilestoneDate": newMilestone.MilestoneDate,
                            "ProgramElementID": 0,
                            "ProjectID": 0,
                        });

                        populateProjectElementMilestoneTableNew();
                        $('#ProjectElementMilestoneModal').modal('hide');
                        $("#ProjectModal").css({ "opacity": "1" });
                        return;
                    }

                    console.log(listToSave);

                    //API to Insert Project Element Milestone
                    wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave,
                        function (response) {
                            console.log(response);
                            var newMilestoneID = response.result.split(',')[1].trim();
                            if (response.result.split(',')[0].trim() === "Success") {
                                $('#ProjectElementMilestoneModal').modal('hide');
                                $("#ProjectModal").css({ "opacity": "1" });

                            } else {
                                dhtmlx.alert({ text: response.result, width: '500px' });
                                $('#ProjectElementMilestoneModal').modal('hide');
                                $("#ProjectModal").css({ "opacity": "1" });
                            }
                            $('#ProjectElementMilestoneModal').modal('hide');
                            $("#ProjectModal").css({ "opacity": "1" });
                            populateProjectElementMilestoneTable(wbsTree.getSelectedProjectID());

                            g_selectedProjectElementMilestone = null; 	//Manasi
                        });
                }

            });

            // SHOW PROJECT ELEMENT MILESTONE MODAL LEGACY
            $('#ProjectElementMilestoneModal').unbind().on('show.bs.modal', function (event) {
                $('#message_div').hide();
                defaultModalPosition();
                var isProjectElementMilestoneUpdate = !g_newProjectElementMilestone;

                $("#ProjectModal").css({ "opacity": "0.4" });

                console.log(g_selectedProjectElementMilestone);


                modal = $(this);
                modal.find('.modal-body #project_element_name').focus();


                if (isProjectElementMilestoneUpdate) {
                    //luan Jquery - luan here
                    console.log('applied jquery');
                    $("#project_element_milestone_date_modal").datepicker();	//datepicker - program contract modal

                    modal.find('.modal-title').text('Project Element Milestone');
                    modal.find('.modal-body #project_element_milestone_name_modal').val(g_selectedProjectElementMilestone.MilestoneName);
                    modal.find('.modal-body #project_element_milestone_description_modal').val(g_selectedProjectElementMilestone.MilestoneDescription);
                    modal.find('.modal-body #project_element_milestone_date_modal').val(g_selectedProjectElementMilestone.MilestoneDate);
                }
                else {	//create new
                    //luan Jquery - luan here
                    console.log('applied jquery');
                    $("#project_element_milestone_date_modal").datepicker();	//datepicker - project element milestone modal

                    modal.find('.modal-title').text('Project Element Milestone');
                    modal.find('.modal-body #project_element_milestone_name_modal').val('');
                    modal.find('.modal-body #project_element_milestone_description_modal').val('');
                    modal.find('.modal-body #project_element_milestone_date_modal').val('');
                }
            });

            // DELETE PROJECT ELEMENT MILESTONE MODAL LEGACY
            //$('#delete_project_element_milestone_modal').click(function () {
            $('#delete_project_element_milestone_modal').unbind().on('click', function (event) {  //Manasi
                dhtmlx.confirm({
                    type: "confirm-warning",
                    text: "Are you sure you want to delete?",
                    callback: function (accept) {
                        if (accept) {
                            var obj = {
                                "Operation": 3,
                                "MilestoneID": g_selectedProjectElementMilestone.MilestoneID,
                                "MilestoneName": g_selectedProjectElementMilestone.MilestoneName,
                                "MilestoneDescription": g_selectedProjectElementMilestone.MilestoneDescription,
                                "MilestoneDate": g_selectedProjectElementMilestone.MilestoneDate,
                                "ProgramElementID": 0,
                                "ProjectID": wbsTree.getSelectedProjectID()
                            }
                            //alert(obj.MilestoneID);
                            //if (obj.MilestoneID === undefined || obj.MilestoneID === null) {
                            //    alert(obj.MilestoneID);
                            //    $('#ProjectElementMilestoneModal').modal('hide');
                            //    $("#ProjectModal").css({ "opacity": "1" });
                            //}
                            var listToSave = [];
                            listToSave.push(obj);

                            wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave,
                                function (response) {
                                    var r = response.result.split(',')[0].trim();
                                    var r1 = r.split(' ')[1].trim();
                                    //alert(r1);
                                    if (response.result.split(',')[0].trim() === "Success") {
                                        //$('#ProgramModal').modal('hide');

                                    }
                                    //Manasi
                                    else if (r1 === "failed") {
                                        var rowId = obj.MilestoneName;
                                        document.getElementById(rowId).remove();
                                        //obj = null;
                                        dhtmlx.alert(rowId + ' has been deleted successfully.');
                                        var index;
                                        for (var x = 0; x < g_project_element_milestone_draft_list.length; x++) {
                                            if (g_project_element_milestone_draft_list[x].MilestoneName === rowId) {
                                                g_project_element_milestone_draft_list.splice(x, 1);
                                            }

                                        }
                                        populateProjectElementMilestoneTableNew();
                                        $('#ProjectElementMilestoneModal').modal('hide');
                                        $("#ProjectModal").css({ "opacity": "1" });
                                    }
                                    else {
                                        dhtmlx.alert({ text: response.result, width: '500px' });
                                        $('#ProjectElementMilestoneModal').modal('hide');
                                        $("#ProjectModal").css({ "opacity": "1" });
                                        populateProjectElementMilestoneTable(wbsTree.getSelectedProjectID()); //Manasi
                                    }
                                    //populateProjectElementMilestoneTable(wbsTree.getSelectedProjectID());  --Manasi

                                });
                            g_selectedProjectElementMilestone = null; //Manasi
                        }
                        //g_selectedProjectElementMilestone = null;
                    }
                });
            });

            // CLICK PROJECT ELEMENT MILESTONE TABLE ROW LEGACY
            $('#project_element_milestone_table_id').on('click', '.clickable-row', function (event) {
                var foundProjectElementMilestone = {};

                if (g_newProject) {
                    console.log(g_project_element_milestone_draft_list);
                    for (var x = 0; x < g_project_element_milestone_draft_list.length; x++) {
                        if (g_project_element_milestone_draft_list[x].MilestoneName == this.id) {
                            foundProjectElementMilestone = g_project_element_milestone_draft_list[x];
                            g_selectedProjectElementMilestone = foundProjectElementMilestone;
                            wbsTree.setSelectedProjectElementMilestone(foundProjectElementMilestone);
                        }
                    }
                } else {
                    //Find the project element milestone based on which one clicked
                    var projectElementMilestoneList = wbsTree.getMilestoneList();
                    for (var x = 0; x < projectElementMilestoneList.length; x++) {
                        if (projectElementMilestoneList[x].MilestoneID == this.id) {
                            foundProjectElementMilestone = projectElementMilestoneList[x];
                            g_selectedProjectElementMilestone = foundProjectElementMilestone;
                            wbsTree.setSelectedProjectElementMilestone(foundProjectElementMilestone);
                        }
                    }
                }
                console.log(g_selectedProjectElementMilestone);

                $("#ProjectElementMilestoneModal").find('.modal-body #project_element_milestone_name').val(foundProjectElementMilestone.MilestoneName);
                $("#ProjectElementMilestoneModal").find('.modal-body #project_element_milestone_description').val(foundProjectElementMilestone.MilestoneDescription);
                $("#ProjectElementMilestoneModal").find('.modal-body #project_element_milestone_date').val(foundProjectElementMilestone.MilestoneDate);
                $(this).addClass('active').siblings().removeClass('active');
            });

            // CLICK ADD PROJECT ELEMENT MILESTONE LEGACY
            $('#new_project_element_milestone').unbind().on('click', function (event) {
                event.preventDefault();    //Manasi 09-03-2021
                g_newProjectElementMilestone = true;
                $('#ProjectElementMilestoneModal').modal({ show: true, backdrop: 'static' });
                $('#delete_project_element_milestone_modal').hide();
                g_selectedProjectElementMilestone = {
                    MilestoneID: 0,
                    MilestoneName: 0,
                    MilestoneDescription: '',
                    MilestoneDate: '',
                    ProgramElementID: 0,
                    ProjectID: 0
                }
            });

            // CLICK EDIT PROJECT ELEMENT MIELSTONE LEGACY
            $('#edit_project_element_milestone').unbind().on('click', function (event) {  //Manasi
                event.preventDefault();    //Manasi 09-03-2021
                g_newProjectElementMilestone = false;
                $('#delete_project_element_milestone_modal').show();
                if ((g_selectedProjectElementMilestone == undefined || g_selectedProjectElementMilestone == null)) {
                    g_selectedProjectElementMilestone = { MilestoneID: 0 };
                }

                if (g_selectedProjectElementMilestone.MilestoneID <= 0) {
                    dhtmlx.alert('Must select a milestone first');
                    return;
                }
                console.log(g_selectedProjectElementMilestone);
                $('#ProjectElementMilestoneModal').modal({ show: true, backdrop: 'static' });
            });

            //Manasi
            $('#cancel_project_element_milestone_modal').click(function () {
                var rowId = g_selectedProjectElementMilestone.MilestoneID;
                if (rowId === undefined || rowId === null) {
                    rowId = g_selectedProjectElementMilestone.MilestoneName;
                }
                var tr = document.getElementById(rowId)
                $(tr).removeClass('active');
                g_selectedProjectElementMilestone = null; 	//Manasi
            });

            $('#cancel_project_element_milestone_modal_x').click(function () {
                var rowId = g_selectedProjectElementMilestone.MilestoneID;
                if (rowId === undefined || rowId === null) {
                    rowId = g_selectedProjectElementMilestone.MilestoneName;
                }
                var tr = document.getElementById(rowId)
                $(tr).removeClass('active');
                g_selectedProjectElementMilestone = null; 	//Manasi
            });
            //===================================================================================== PROJECT ELEMENT MILESTONE END ===================================================================



            //===================================================================================== PROGRAM ELEMENT MILESTONE START ===================================================================
            // UPDATE PROGRAM ELEMENT MILESTONE MODAL LEGACY
            $('#update_program_element_milestone_modal').unbind('click').on('click', function () {

                var MileStoneTile = modal.find('.modal-body #program_element_milestone_name_modal').val();
                var MilestoneDescp = modal.find('.modal-body #program_element_milestone_description_modal').val();
                var MilestoneDate = modal.find('.modal-body #program_element_milestone_date_modal').val();

                if (MileStoneTile == "" || MileStoneTile.length == 0) {
                    //dhtmlx.alert('Enter Tile.');
                    dhtmlx.alert('Enter Title.');   //Manasi
                    return;
                }
                if (MilestoneDescp == "" || MilestoneDescp.length == 0) {
                    dhtmlx.alert('Enter Description.');
                    return;
                }
                if (MilestoneDate == "" || MilestoneDate.length == 0) {
                    dhtmlx.alert('Enter Date.');
                    return;
                }

                console.log(g_newProgramElementMilestone);

                if (!g_newProgramElementMilestone) {   //Update
                    var updatedMilestone = g_selectedProgramElementMilestone;
                    var isModified = true;

                    updatedMilestone.MilestoneName = modal.find('.modal-body #program_element_milestone_name_modal').val();
                    updatedMilestone.MilestoneDescription = modal.find('.modal-body #program_element_milestone_description_modal').val();
                    updatedMilestone.MilestoneDate = modal.find('.modal-body #program_element_milestone_date_modal').val();

                    if (g_newProgramElement) {
                        //Find the one in the draft list
                        for (var x = 0; x < g_program_element_milestone_draft_list.length; x++) {
                            if (g_program_element_milestone_draft_list[x].MilestoneName == g_selectedProgramElementMilestone.MilestoneName
                                && g_program_element_milestone_draft_list[x].MilestoneDescription == g_selectedProgramElementMilestone.MilestoneDescription
                                && g_program_element_milestone_draft_list[x].MilestoneDate == g_selectedProgramElementMilestone.MilestoneDate) {
                                g_program_element_milestone_draft_list[x].MilestoneName = updatedMilestone.MilestoneName;
                                g_program_element_milestone_draft_list[x].MilestoneDescription = updatedMilestone.MilestoneDescription;
                                g_program_element_milestone_draft_list[x].MilestoneDate = updatedMilestone.MilestoneDate;
                            }
                        }
                        populateProgramElementMilestoneTableNew();
                        $('#ProgramElementMilestoneModal').modal('hide');
                        $("#ProgramElementModal").css({ "opacity": "1" });
                        return;
                    }

                    var obj = {
                        "Operation": 2,
                        "MilestoneID": updatedMilestone.MilestoneID,
                        "MilestoneName": updatedMilestone.MilestoneName,
                        "MilestoneDescription": updatedMilestone.MilestoneDescription,
                        "MilestoneDate": updatedMilestone.MilestoneDate,
                        "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                        "ProjectID": 0,
                    }

                    var listToSave = [];
                    listToSave.push(obj);

                    //API to Insert/Update
                    wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave, function (response) {
                        if (response.result.split(',')[0].trim() === "Success") {
                            //$('#ProgramModal').modal('hide');
                        } else {
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                        }

                        $('#ProgramElementMilestoneModal').modal('hide');
                        $("#ProgramElementModal").css({ "opacity": "1" });
                        populateProgramElementMilestoneTable(wbsTree.getSelectedProgramElementID());

                        g_selectedProgramElementMilestone = null; 	//Manasi
                    });
                }

                if (g_newProgramElementMilestone) {
                    var newNode = { name: "New Program Element Milestone" };
                    var newMilestone = {};

                    newMilestone.MilestoneName = modal.find('.modal-body #program_element_milestone_name_modal').val();
                    newMilestone.MilestoneDescription = modal.find('.modal-body #program_element_milestone_description_modal').val();
                    newMilestone.MilestoneDate = modal.find('.modal-body #program_element_milestone_date_modal').val();

                    var obj = {
                        "Operation": 1,
                        "MilestoneName": newMilestone.MilestoneName,
                        "MilestoneDescription": newMilestone.MilestoneDescription,
                        "MilestoneDate": newMilestone.MilestoneDate,
                        "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                        "ProjectID": 0,
                    }

                    var listToSave = [];
                    listToSave.push(obj);

                    if (g_newProgramElement) {
                        g_program_element_milestone_draft_list.push({
                            "Operation": 1,
                            "MilestoneName": newMilestone.MilestoneName,
                            "MilestoneDescription": newMilestone.MilestoneDescription,
                            "MilestoneDate": newMilestone.MilestoneDate,
                            "ProgramElementID": 0,
                            "ProjectID": 0,
                        });

                        populateProgramElementMilestoneTableNew();
                        $('#ProgramElementMilestoneModal').modal('hide');
                        $("#ProgramElementModal").css({ "opacity": "1" });
                        return;
                    }

                    console.log(listToSave);

                    //API to Insert Program Element Milestone
                    wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave,
                        function (response) {
                            console.log(response);
                            var newMilestoneID = response.result.split(',')[1].trim();
                            if (response.result.split(',')[0].trim() === "Success") {
                                $('#ProgramElementMilestoneModal').modal('hide');
                                $("#ProgramElementModal").css({ "opacity": "1" });

                            } else {
                                dhtmlx.alert({ text: response.result, width: '500px' });
                                $('#ProgramElementMilestoneModal').modal('hide');
                                $("#ProgramElementModal").css({ "opacity": "1" });
                            }
                            $('#ProgramElementMilestoneModal').modal('hide');
                            $("#ProgramElementModal").css({ "opacity": "1" });
                            populateProgramElementMilestoneTable(wbsTree.getSelectedProgramElementID());

                            g_selectedProgramElementMilestone = null; 	//Manasi
                        });
                }

            });

            // SHOW PROGRAM ELEMENT MILESTONE MODAL LEGACY
            $('#ProgramElementMilestoneModal').unbind().on('show.bs.modal', function (event) {
                $('#message_div').hide();
                defaultModalPosition();
                var isProgramElementMilestoneUpdate = !g_newProgramElementMilestone;

                $("#ProgramElementModal").css({ "opacity": "0.4" });

                console.log(g_selectedProgramElementMilestone);


                modal = $(this);
                modal.find('.modal-body #program_element_name').focus();


                if (isProgramElementMilestoneUpdate) {
                    //luan Jquery - luan here
                    console.log('applied jquery');
                    $("#program_element_milestone_date_modal").datepicker();	//datepicker - program contract modal

                    //modal.find('.modal-title').text('Program Element Milestone'); Manasi
                    modal.find('.modal-title').text('Key Project Milestone');
                    modal.find('.modal-body #program_element_milestone_name_modal').val(g_selectedProgramElementMilestone.MilestoneName);
                    modal.find('.modal-body #program_element_milestone_description_modal').val(g_selectedProgramElementMilestone.MilestoneDescription);
                    modal.find('.modal-body #program_element_milestone_date_modal').val(g_selectedProgramElementMilestone.MilestoneDate);
                }
                else {	//create new
                    //luan Jquery - luan here
                    console.log('applied jquery');
                    $("#program_element_milestone_date_modal").datepicker();	//datepicker - program element milestone modal

                    //modal.find('.modal-title').text('Program Element Milestone'); Manasi
                    modal.find('.modal-title').text('Key Project Milestone');
                    modal.find('.modal-body #program_element_milestone_name_modal').val('');
                    modal.find('.modal-body #program_element_milestone_description_modal').val('');
                    modal.find('.modal-body #program_element_milestone_date_modal').val('');
                }
            });

            // DELETE PROGRAM ELEMENT MILESTONE MODAL LEGACY
            //$('#delete_program_element_milestone_modal').click(function () {
            $('#delete_program_element_milestone_modal').unbind().on('click', function (event) {  //Manasi

                dhtmlx.confirm({
                    type: "confirm-warning",
                    text: "Are you sure you want to delete?",
                    callback: function (accept) {
                        if (accept) {
                            var obj = {
                                "Operation": 3,
                                "MilestoneID": g_selectedProgramElementMilestone.MilestoneID,
                                "MilestoneName": g_selectedProgramElementMilestone.MilestoneName,
                                "MilestoneDescription": g_selectedProgramElementMilestone.MilestoneDescription,
                                "MilestoneDate": g_selectedProgramElementMilestone.MilestoneDate,
                                "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                                "ProjectID": 0
                            }

                            var listToSave = [];
                            listToSave.push(obj);

                            wbsTree.getUpdateMilestone({ ProjectID: 1 }).save(listToSave,
                                function (response) {
                                    var r = response.result.split(',')[0].trim();
                                    var r1 = r.split(' ')[1].trim();
                                    if (response.result.split(',')[0].trim() === "Success") {
                                        //$('#ProgramModal').modal('hide');

                                    }
                                    //Manasi
                                    else if (r1 === "failed") {
                                        var rowId = obj.MilestoneName;
                                        document.getElementById(rowId).remove();
                                        //obj = null;
                                        dhtmlx.alert(rowId + ' has been deleted successfully.');
                                        var index;
                                        for (var x = 0; x < g_program_element_milestone_draft_list.length; x++) {
                                            if (g_program_element_milestone_draft_list[x].MilestoneName === rowId) {
                                                g_program_element_milestone_draft_list.splice(x, 1);
                                            }

                                        }
                                        populateProgramElementMilestoneTableNew();
                                        $('#ProgramElementMilestoneModal').modal('hide');
                                        $("#ProgramElementModal").css({ "opacity": "1" });
                                    }
                                    else {
                                        dhtmlx.alert({ text: response.result, width: '500px' });
                                        $('#ProgramElementMilestoneModal').modal('hide');
                                        $("#ProgramElementModal").css({ "opacity": "1" });

                                        populateProgramElementMilestoneTable(wbsTree.getSelectedProgramElementID()); //Manasi
                                    }
                                    //populateProgramElementMilestoneTable(wbsTree.getSelectedProgramElementID());  --Manasi

                                });
                            g_selectedProjectElementMilestone = null; //Manasi
                        }
                        //g_selectedProgramElementMilestone = null; 	//Manasi
                    }
                });
            });

            // CLICK PROGRAM ELEMENT MILESTONE TABLE ROW LEGACY
            $('#program_element_milestone_table_id').on('click', '.clickable-row', function (event) {
                var foundProgramElementMilestone = {};

                if (g_newProgramElement) {
                    console.log(g_program_element_milestone_draft_list);
                    for (var x = 0; x < g_program_element_milestone_draft_list.length; x++) {
                        if (g_program_element_milestone_draft_list[x].MilestoneName == this.id) {
                            foundProgramElementMilestone = g_program_element_milestone_draft_list[x];
                            g_selectedProgramElementMilestone = foundProgramElementMilestone;
                            wbsTree.setSelectedProgramElementMilestone(foundProgramElementMilestone);
                        }
                    }
                } else {
                    //Find the program element milestone based on which one clicked
                    var programElementMilestoneList = wbsTree.getMilestoneList();
                    for (var x = 0; x < programElementMilestoneList.length; x++) {
                        if (programElementMilestoneList[x].MilestoneID == this.id) {
                            foundProgramElementMilestone = programElementMilestoneList[x];
                            g_selectedProgramElementMilestone = foundProgramElementMilestone;
                            wbsTree.setSelectedProgramElementMilestone(foundProgramElementMilestone);
                        }
                    }
                }
                console.log(g_selectedProgramElementMilestone);

                $("#ProgramElementMilestoneModal").find('.modal-body #program_element_milestone_name').val(foundProgramElementMilestone.MilestoneName);
                $("#ProgramElementMilestoneModal").find('.modal-body #program_element_milestone_description').val(foundProgramElementMilestone.MilestoneDescription);
                $("#ProgramElementMilestoneModal").find('.modal-body #program_element_milestone_date').val(foundProgramElementMilestone.MilestoneDate);
                $(this).addClass('active').siblings().removeClass('active');
            });

            // CLICK ADD PROGRAM ELEMENT MILESTONE LEGACY
            $('#new_program_element_milestone').unbind().on('click', function (event) {  //Manasi
                event.preventDefault();   //Manasi 08-03-2021
                g_newProgramElementMilestone = true;
                $('#ProgramElementMilestoneModal').modal({ show: true, backdrop: 'static' });
                $('#delete_program_element_milestone_modal').hide();
                g_selectedProgramElementMilestone = {
                    MilestoneID: 0,
                    MilestoneName: 0,
                    MilestoneDescription: '',
                    MilestoneDate: '',
                    ProgramElementID: 0,
                    ProjectID: 0
                }
            });

            // CLICK EDIT PROGRAM ELEMENT MIELSTONE LEGACY
            $('#edit_program_element_milestone').unbind().on('click', function (event) { //Manasi
                event.preventDefault();    //Manasi 09-03-2021
                g_newProgramElementMilestone = false;
                //$('#delete_program_contract_modal').show();
                $('#delete_program_element_milestone_modal').show();
                if ((g_selectedProgramElementMilestone == undefined || g_selectedProgramElementMilestone == null)) {
                    g_selectedProgramElementMilestone = { MilestoneID: 0 };
                }

                if (g_selectedProgramElementMilestone.MilestoneID <= 0) {
                    dhtmlx.alert('Must select a milestone first');
                    return;
                }
                console.log(g_selectedProgramElementMilestone);
                $('#ProgramElementMilestoneModal').modal({ show: true, backdrop: 'static' });
            });


            //Manasi
            $('#cancel_program_element_milestone_modal').click(function () {
                var rowId = g_selectedProgramElementMilestone.MilestoneID;
                if (rowId === undefined || rowId === null) {
                    rowId = g_selectedProgramElementMilestone.MilestoneName;
                }
                var tr = document.getElementById(rowId)
                $(tr).removeClass('active');
                g_selectedProgramElementMilestone = null; 	//Manasi
            });

            $('#cancel_program_element_milestone_modal_x').click(function () {
                var rowId = g_selectedProgramElementMilestone.MilestoneID;
                if (rowId === undefined || rowId === null) {
                    rowId = g_selectedProgramElementMilestone.MilestoneName;
                }
                var tr = document.getElementById(rowId)
                $(tr).removeClass('active');
                g_selectedProgramElementMilestone = null; 	//Manasi
            });
            //===================================================================================== PROGRAM ELEMENT MILESTONE END ===================================================================


            //===================================================================================== PROGRAM ELEMENT CHANGE ORDER START ===================================================================
            // UPDATE PROGRAM ELEMENT CHANGE ORDER MODAL LEGACY
            $('#update_program_element_change_order_modal').unbind('click').on('click', function () {

                $('#fileUploadProgramElementChangeOrderModal').prop('disabled', false);  //Manasi 20-08-2020
                //$('#uploadBtnProgramelmtCOspinRow').show();   //Manasi 20-08-2020

                var selectedNode = wbsTree.getSelectedNode();
                if (selectedNode.level == "Program") {
                    dhtmlx.alert('Change Order only work in edit mode.');
                    return;
                }
                console.log(g_newProgramElementChangeOrder);
                // var files = fileUploadProgramElementChangeOrderModal.files;
                // var fileName = "";
                //if (files.length != 0 || files.length) {
                //    angular.forEach(fileUploadProgramElementChangeOrderModal.files, function (value, key) {
                //        fileName = value.name;
                //    });
                //}

                var CoTitle = $("#program_element_change_order_name_modal").val();
                var ChangeOrderTypedd = $("#program_element_change_order_ddModificationType").val();;
                var OrderNo = $("#program_element_change_order_number_modal").val();
                var OrderDte = $("#ChangeOrderDate").val();
                var AmtOrder = $("#program_element_change_order_amount_modal").val();
                var SpNote = $("#program_element_change_order_schedule_change_modal").val();
                var Reason = $("#program_element_change_order_Reason_modal").val();
                var modType = $('#program_element_change_order_ddModificationType').val();
                //var durationDate = $('#program_element_change_order_duration_date').val(); // Jignesh-24-03-2021
                var scheduleImpact = $('#program_element_change_order_schedule_impact').val(); // Jignesh-24-03-2021

                if (CoTitle == "" || CoTitle.length == 0) {
                    dhtmlx.alert('Enter Title.');
                    return;
                }
                if (OrderDte == "" || OrderDte.length == 0) {
                    dhtmlx.alert('Enter Date.');
                    return;
                }
                if (Reason == "" || Reason.length == 0) {
                    dhtmlx.alert('Enter Reason.');
                    return;
                }
                if (SpNote == "" || SpNote.length == 0) {
                    dhtmlx.alert('Enter Description.'); // Jignesh-18-02-2021
                    return;
                }
                if (OrderNo == "" || OrderNo.length == 0) {
                    dhtmlx.alert('Enter Client Change Order No.'); // Jignesh-08-02-2021
                    return;
                }
                if (ChangeOrderTypedd == null || ChangeOrderTypedd == 0) {
                    dhtmlx.alert('Select Order Type.');
                    return;
                }
                //if (AmtOrder == "" || AmtOrder.length == 0) {
                //    dhtmlx.alert('Enter Amount.');
                //    return;
                //}

                if (modType != "" || modType.length != 0) {
                    if (modType == 1) {
                        if (AmtOrder == "" || AmtOrder.length == 0) {
                            dhtmlx.alert('Enter Value.');
                            return;
                        }
                    }
                    else if (modType == 2) {//changeOrderScheduleImpact
                        // Jignesh-24-03-2021
                        //if (durationDate == "" || durationDate.length == 0) {
                        //    dhtmlx.alert('Enter Duration Date.');
                        //    return;
                        //}
                        if (scheduleImpact == "" || scheduleImpact.length == 0) {
                            dhtmlx.alert('Enter Schedule Impact.');
                            return;
                        }
                    }
                    else if (modType == 3) {
                        if (AmtOrder == "" || AmtOrder.length == 0) {
                            dhtmlx.alert('Enter Value.'); // Jignesh-18-02-2021
                            return;
                        }
                        // Jignesh-24-03-2021
                        if (scheduleImpact == "" || scheduleImpact.length == 0) {
                            dhtmlx.alert('Enter Schedule Impact.');
                            return;
                        }
                        //if (durationDate == "" || durationDate.length == 0) {
                        //    dhtmlx.alert('Enter Duration Date.');
                        //    return;
                        //}
                    }
                }
                //  alert(fileName);
                // alert(g_newProgramElementChangeOrder);
                if (!g_newProgramElementChangeOrder) {   //Update  ppuu
                    var updatedChangeOrder = g_selectedProgramElementChangeOrder;
                    var isModified = true;

                    updatedChangeOrder.ChangeOrderName = modal.find('.modal-body #program_element_change_order_name_modal').val();
                    updatedChangeOrder.ChangeOrderNumber = modal.find('.modal-body #program_element_change_order_number_modal').val();
                    updatedChangeOrder.ChangeOrderAmount = modal.find('.modal-body #program_element_change_order_amount_modal').val();
                    updatedChangeOrder.ChangeOrderScheduleChange = modal.find('.modal-body #program_element_change_order_schedule_change_modal').val();
                    updatedChangeOrder.OrderType = modal.find('.modal-body #ChangeOrderType').val();
                    updatedChangeOrder.OrderDate = modal.find('.modal-body #ChangeOrderDate').val();

                    //================== Jignesh-ChangeOrderPopUpChanges ====================================
                    updatedChangeOrder.Reason = modal.find('.modal-body #program_element_change_order_Reason_modal').val();
                    updatedChangeOrder.ModificationTypeId = modal.find('.modal-body #program_element_change_order_ddModificationType').val();
                    //updatedChangeOrder.DurationDate = modal.find('.modal-body #program_element_change_order_duration_date').val(); // Jignesh-24-03-2021
                    updatedChangeOrder.ScheduleImpact = modal.find('.modal-body #program_element_change_order_schedule_impact').val(); // Jignesh-24-03-2021
                    //=======================================================================================

                    if (g_newProgramElement) {
                        //Find the one in the draft list
                        for (var x = 0; x < g_program_element_change_order_draft_list.length; x++) {
                            if (g_program_element_change_order_draft_list[x].ChangeOrderName == g_selectedProgramElementChangeOrder.ChangeOrderName
                                && g_program_element_change_order_draft_list[x].ChangeOrderNumber == g_selectedProgramElementChangeOrder.ChangeOrderNumber
                                && g_program_element_change_order_draft_list[x].ChangeOrderAmount == g_selectedProgramElementChangeOrder.ChangeOrderAmount
                                && g_program_element_change_order_draft_list[x].ChangeOrderScheduleChange == g_selectedProgramElementChangeOrder.ChangeOrderScheduleChange) {
                                //  g_program_element_change_order_draft_list[x].DocumentName = fileName;
                                g_program_element_change_order_draft_list[x].ChangeOrderName = updatedChangeOrder.ChangeOrderName;
                                g_program_element_change_order_draft_list[x].ChangeOrderNumber = updatedChangeOrder.ChangeOrderNumber;
                                g_program_element_change_order_draft_list[x].ChangeOrderAmount = updatedChangeOrder.ChangeOrderAmount;
                                g_program_element_change_order_draft_list[x].ChangeOrderScheduleChange = updatedChangeOrder.ChangeOrderScheduleChange;
                                g_program_element_change_order_draft_list[x].OrderType = updatedChangeOrder.OrderType;
                                g_program_element_change_order_draft_list[x].OrderDate = updatedChangeOrder.OrderDate;
                                //================== Jignesh-ChangeOrderPopUpChanges ====================================
                                g_program_element_change_order_draft_list[x].Reason = updatedChangeOrder.Reason;
                                g_program_element_change_order_draft_list[x].ModificationTypeId = updatedChangeOrder.ModificationTypeId;
                                //g_program_element_change_order_draft_list[x].DurationDate = updatedChangeOrder.DurationDate; // Jignesh-24-03-2021
                                g_program_element_change_order_draft_list[x].ScheduleImpact = updatedChangeOrder.ScheduleImpact; // Jignesh-24-03-2021
                                //=======================================================================================

                                if (wbsTree.getProgramElementChangeOrderFileDraft().length > 0) {
                                    g_program_element_change_order_draft_list[x].DocumentDraft = wbsTree.getProgramElementChangeOrderFileDraft();
                                }
                            }
                        }
                        populateProgramElementChangeOrderTableNew();
                        $('#ProgramElementChangeOrderModal').modal('hide');
                        $("#ProgramElementModal").css({ "opacity": "1" });
                        return;
                    }

                    var obj = {
                        "Operation": 2,
                        "ChangeOrderID": updatedChangeOrder.ChangeOrderID,
                        "ChangeOrderName": updatedChangeOrder.ChangeOrderName,
                        "ChangeOrderNumber": updatedChangeOrder.ChangeOrderNumber,
                        "ChangeOrderAmount": updatedChangeOrder.ChangeOrderAmount.replace('$', ''),
                        "ChangeOrderScheduleChange": updatedChangeOrder.ChangeOrderScheduleChange,
                        "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                        "OrderType": updatedChangeOrder.OrderType,
                        "OrderDate": updatedChangeOrder.OrderDate,
                        //================== Jignesh-ChangeOrderPopUpChanges ====================================
                        "Reason": updatedChangeOrder.Reason,
                        "ModificationTypeId": updatedChangeOrder.ModificationTypeId,
                        //"DurationDate": updatedChangeOrder.DurationDate // Jignesh-24-03-2021
                        "ScheduleImpact": updatedChangeOrder.ScheduleImpact // Jignesh-24-03-2021
                        //=======================================================================================
                    }

                    var listToSave = [];
                    listToSave.push(obj);

                    //API to Insert/Update ppbb
                    wbsTree.getUpdateChangeOrder({ ProjectID: 1 }).save(listToSave, function (response) {
                        //alert(response.result.split(',')[0]); //Manasi
                        //if (response.result.split(',')[0].trim() === "Success") {successfully
                        if (response.result.indexOf('successfully') >= 0) {  //Manasi
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                            //-------Manasi
                            $('#ProgramElementChangeOrderModal').modal('hide');
                            $("#ProgramElementModal").css({ "opacity": "1" });
                            //$('#ProgramModal').modal('hide');
                        } else {
                            dhtmlx.alert({
                                text: response.result,
                                width: '500px'
                            });
                            return;  //Manasi
                        }

                        $('#ProgramElementChangeOrderModal').modal('hide');
                        $("#ProgramElementModal").css({ "opacity": "1" });
                        populateProgramElementChangeOrderTable(wbsTree.getSelectedProgramElementID());

                        g_selectedProgramElementChangeOrder = null; 	//Manasi
                        //$('#uploadBtnProgramelmtCOspinRow').hide()     //Manasi 20-08-2020
                        document.getElementById("uploadBtnProgramelmtCOspinRow").style.display = "none";   //Manasi 20-08-2020
                    });

                }

                if (g_newProgramElementChangeOrder) {
                    var newNode = { name: "New Program Element Change Order" };
                    var newChangeOrder = {};

                    newChangeOrder.ChangeOrderName = modal.find('.modal-body #program_element_change_order_name_modal').val();
                    newChangeOrder.ChangeOrderNumber = modal.find('.modal-body #program_element_change_order_number_modal').val();
                    newChangeOrder.ChangeOrderAmount = modal.find('.modal-body #program_element_change_order_amount_modal').val();
                    newChangeOrder.ChangeOrderScheduleChange = modal.find('.modal-body #program_element_change_order_schedule_change_modal').val();
                    newChangeOrder.OrderType = modal.find('.modal-body #ChangeOrderType').val();
                    newChangeOrder.OrderDate = modal.find('.modal-body #ChangeOrderDate').val();
                    //================== Jignesh-ChangeOrderPopUpChanges ====================================
                    newChangeOrder.Reason = modal.find('.modal-body #program_element_change_order_Reason_modal').val();
                    newChangeOrder.ModificationTypeId = modal.find('.modal-body #program_element_change_order_ddModificationType').val();
                    //newChangeOrder.DurationDate = modal.find('.modal-body #program_element_change_order_duration_date').val(); // Jignesh-24-03-2021
                    newChangeOrder.ScheduleImpact = modal.find('.modal-body #program_element_change_order_schedule_impact').val(); // Jignesh-24-03-2021
                    //=======================================================================================

                    var obj = {
                        "Operation": 1,
                        "ChangeOrderID": 0,
                        "ChangeOrderName": newChangeOrder.ChangeOrderName,
                        "ChangeOrderNumber": newChangeOrder.ChangeOrderNumber,
                        "ChangeOrderAmount": newChangeOrder.ChangeOrderAmount.replace('$', ''),
                        "ChangeOrderScheduleChange": newChangeOrder.ChangeOrderScheduleChange,
                        "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                        "OrderType": newChangeOrder.OrderType,
                        "OrderDate": newChangeOrder.OrderDate, //.replace(/\//g, ""),
                        //================== Jignesh-ChangeOrderPopUpChanges ====================================
                        "Reason": newChangeOrder.Reason,
                        "ModificationTypeId": newChangeOrder.ModificationTypeId,
                        //"DurationDate": newChangeOrder.DurationDate // Jignesh-24-03-2021
                        "ScheduleImpact": newChangeOrder.ScheduleImpact // Jignesh-24-03-2021
                        //=======================================================================================
                    }

                    var listToSave = [];
                    listToSave.push(obj);

                    //   alert(g_newProgramElement);
                    if (g_newProgramElement) {
                        g_program_element_change_order_draft_list.push({
                            "Operation": 1,
                            "ChangeOrderID": 0,
                            //"DocumentName": fileName,
                            "ChangeOrderName": newChangeOrder.ChangeOrderName,
                            "ChangeOrderNumber": newChangeOrder.ChangeOrderNumber,
                            "ChangeOrderAmount": newChangeOrder.ChangeOrderAmount.replace('$', ''),
                            "ChangeOrderScheduleChange": newChangeOrder.ChangeOrderScheduleChange,
                            "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                            "OrderType": newChangeOrder.OrderType,
                            "OrderDate": newChangeOrder.OrderDate,
                            //================== Jignesh-ChangeOrderPopUpChanges ====================================
                            "Reason": newChangeOrder.Reason,
                            "ModificationTypeId": newChangeOrder.ModificationTypeId,
                            //"DurationDate": newChangeOrder.DurationDate // Jignesh-24-03-2021
                            "ScheduleImpact": newChangeOrder.ScheduleImpact // Jignesh-24-03-2021
                            //=======================================================================================
                        });

                        // alert(fileName);
                        //ppaaa
                        populateProgramElementChangeOrderTableNew();
                        $('#ProgramElementChangeOrderModal').modal('hide');
                        $("#ProgramElementModal").css({ "opacity": "1" });
                        return;
                    }

                    console.log(listToSave);

                    //API to Insert Program Element CHANGE ORDER
                    wbsTree.getUpdateChangeOrder({ ProjectID: 1 }).save(listToSave,
                        function (response) {
                            console.log(response);
                            //var newChangeOrderID = response.result.split(',')[1].trim();
                            if (response.result.split(',')[0].trim() === "Success") {

                                var newChangeOrderID = response.result.split(',')[1].trim();

                                //Upload draft documents
                                var index = 0;

                                var apiUpload = function () {
                                    if ($('#program_element_change_order_file_name').html().length == 0) {
                                        return;
                                    }
                                    //if (index >= wbsTree.getProgramElementChangeOrderFileDraft().length) {
                                    //    return;
                                    //}
                                    docTypeID = 1;
                                    // docTypeID = wbsTree.getProgramElementChangeOrderFileDraft()[index].docTypeID;
                                    //  formdata = wbsTree.getProgramElementChangeOrderFileDraft()[index].formdata;

                                    formdata = new FormData();
                                    var fileName = "";
                                    angular.forEach(fileUploadProgramElementChangeOrderModal.files, function (value, key) {
                                        fileName = value.name;
                                        formdata.append(key, value);
                                    });
                                    var request = {
                                        method: 'POST',
                                        url: serviceBasePath + '/uploadFiles/Post/ProgramElementChangeOrder/0/0/0/0/' + newChangeOrderID + '/' + docTypeID,
                                        data: formdata, //fileUploadProject.files, //$scope.
                                        ignore: true,
                                        headers: {
                                            'Content-Type': undefined
                                        }
                                    };

                                    var angularHttp = wbsTree.getAngularHttp();
                                    angularHttp(request).then(function success(d) {
                                        console.log(d);
                                        populateProgramElementChangeOrderTable(wbsTree.getSelectedProgramElementID());  //Manasi
                                        $('#program_element_change_order_file_name').empty();

                                        document.getElementById("fileUploadProgramElementChangeOrderModal").value = "";

                                        //$('#uploadBtnProgramelmtCOspinRow').hide();     //Manasi 20-08-2020
                                        document.getElementById("uploadBtnProgramelmtCOspinRow").style.display = "none";   //Manasi 20-08-2020
                                    });
                                }

                                apiUpload();// Paa

                                populateProgramElementChangeOrderTableNew(); //Manasi
                                $('#ProgramElementChangeOrderModal').modal('hide');
                                $("#ProgramElementModal").css({ "opacity": "1" });

                            } else {
                                //$('#uploadBtnProgramelmtCOspinRow').hide();     //Manasi 20-08-2020
                                document.getElementById("uploadBtnProgramelmtCOspinRow").style.display = "none";   //Manasi 20-08-2020
                                dhtmlx.alert({ text: response.result, width: '500px' });
                                //$('#ProgramElementChangeOrderModal').modal('hide');  Manasi
                                //$("#ProgramElementModal").css({ "opacity": "1" });
                                return; //Manasi
                            }
                            $('#ProgramElementChangeOrderModal').modal('hide');
                            $("#ProgramElementModal").css({ "opacity": "1" });
                            populateProgramElementChangeOrderTable(wbsTree.getSelectedProgramElementID());

                            g_selectedProgramElementChangeOrder = null; 	//Manasi
                            //  $('#program_element_change_order_file_name').empty(); // manasi 7 jul 2020
                        });

                    //$('#program_element_change_order_file_name').empty();

                    //document.getElementById("fileUploadProgramElementChangeOrderModal").value = ""; prith commented on 24jul2020 as was not abe to save
                }



            });

            // SHOW PROGRAM ELEMENT CHANGE ORDER MODAL LEGACY
            $('#ProgramElementChangeOrderModal').unbind().on('show.bs.modal', function (event) {
                $('#message_div').hide();
                defaultModalPosition();
                var isProgramElementChangeOrderUpdate = !g_newProgramElementChangeOrder;

                $("#ProgramElementModal").css({ "opacity": "0.4" });

                console.log(g_selectedProgramElementChangeOrder);


                modal = $(this);
                //modal.find('.modal-body #program_element_name').focus();


                //load docTypeList
                var docTypeDropDownProgramElementChangeOrder = modal.find('.modal-body #document_type_program_element_change_order_modal');
                var docTypeList = wbsTree.getDocTypeList();
                docTypeDropDownProgramElementChangeOrder.empty();

                for (var x = 0; x < docTypeList.length; x++) {
                    docTypeDropDownProgramElementChangeOrder.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                }

                docTypeDropDownProgramElementChangeOrder.val('');



                $('#program_element_change_order_file_name').empty();

                console.log(g_selectedProgramElementChangeOrder);

                if (isProgramElementChangeOrderUpdate && !g_newProgramElement) {
                    _Document.getDocumentByProjID().get({ DocumentSet: 'ProgramElementChangeOrder', ProjectID: g_selectedProgramElementChangeOrder.ChangeOrderID }, function (response) {
                        wbsTree.setDocumentList(response.result);

                        console.log(_documentList);

                        if (_documentList.length > 0) {
                            $('#program_element_change_order_file_name').prepend('<a href="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[0].DocumentID + '">' + _documentList[0].DocumentName + '</a>')
                        }

                        var deleteDocBtn = modal.find('.modal-body #delete-doc-program-element-change-order-modal');
                        deleteDocBtn.attr('disabled', _documentList.length > 0 ? false : true);
                    });
                } else if (isProgramElementChangeOrderUpdate && g_newProgramElement) {
                    if (g_selectedProgramElementChangeOrder.DocumentDraft.length > 0) {
                        $('#program_element_change_order_file_name').empty();
                        $('#program_element_change_order_file_name').prepend('<label>' + g_selectedProgramElementChangeOrder.DocumentDraft[0].fileName + '</a>');
                    }
                }


                var selectedNode = { ContractNumber: '123', ContractName: 'Luan', ContractStartDate: '12/12/2012', ContractEndDate: '10/10/2010', ProjectClassID: 8 };	//Get selected contract

                modal = $(this);
                modal.find('.modal-body #program_name').focus();


                wbsTree.setProgramContractFileDraft([]);





                if (isProgramElementChangeOrderUpdate) {
                    //luan Jquery - luan here
                    console.log('applied jquery');
                    _Is_Program_Element_Change_Order_New = false;
                    //============================= Jignesh-ChangeOrderPopUpChanges ============================================
                    var angularHttp = wbsTree.getAngularHttp();
                    angularHttp.get(serviceBasePath + 'Request/GetModificationTypes').then(function (response) {
                        modificationTypeData = response.data.result;
                        var modificationTypeDropDown = $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_ddModificationType');
                        modificationTypeDropDown.empty();

                        for (var x = 0; x < modificationTypeData.length; x++) {
                            if (modificationTypeData[x].ModificationTypeId == g_selectedProgramElementChangeOrder.ModificationTypeId) {
                                modificationTypeDropDown.append('<option value="' + modificationTypeData[x].ModificationTypeId + '" selected> ' + modificationTypeData[x].ModType + '</option>');
                                modificationTypeDropDown.val(modificationTypeData[x].ModificationTypeId);
                            } else {
                                modificationTypeDropDown.append('<option value="' + modificationTypeData[x].ModificationTypeId + '"> ' + modificationTypeData[x].ModType + '</option>');
                            }
                        }

                    });
                    modal.find('.modal-title').text('Project Change Order'); //Manasi Change title from Program Element Change Order to Project Change Order 
                    modal.find('.modal-body #program_element_change_order_name_modal').val(g_selectedProgramElementChangeOrder.ChangeOrderName);
                    modal.find('.modal-body #program_element_change_order_number_modal').val(g_selectedProgramElementChangeOrder.ChangeOrderNumber);
                    //modal.find('.modal-body #program_element_change_order_amount_modal').val(g_selectedProgramElementChangeOrder.ChangeOrderAmount);
                    modal.find('.modal-body #program_element_change_order_schedule_change_modal').val(g_selectedProgramElementChangeOrder.ChangeOrderScheduleChange);
                    modal.find('.modal-body #ChangeOrderType').val(g_selectedProgramElementChangeOrder.OrderType);
                    modal.find('.modal-body #ChangeOrderDate').val(g_selectedProgramElementChangeOrder.OrderDate);
                    modal.find('.modal-body #program_element_change_order_Reason_modal').val(g_selectedProgramElementChangeOrder.Reason);

                    var ddValue = g_selectedProgramElementChangeOrder.ModificationTypeId;
                    if (ddValue == 1) {
                        modal.find('.modal-body #program_element_change_order_amount_modal').val('$' + g_selectedProgramElementChangeOrder.ChangeOrderAmount);
                        $('#divChangeOrderAmount').show();
                        $('#divDurationDate').hide();
                    }
                    else if (ddValue == 2) {
                        //modal.find('.modal-body #program_element_change_order_duration_date').val(moment(g_selectedProgramElementChangeOrder.DurationDate).format('MM/DD/YYYY')); // Jignesh-24-03-2021
                        modal.find('.modal-body #program_element_change_order_schedule_impact').val(g_selectedProgramElementChangeOrder.ScheduleImpact); // Jignesh-24-03-2021
                        $('#divChangeOrderAmount').hide();
                        $('#divDurationDate').show();
                    }
                    else if (ddValue == 3) {
                        modal.find('.modal-body #program_element_change_order_amount_modal').val('$' + g_selectedProgramElementChangeOrder.ChangeOrderAmount);
                        //modal.find('.modal-body #program_element_change_order_duration_date').val(moment(g_selectedProgramElementChangeOrder.DurationDate).format('MM/DD/YYYY')); // Jignesh-24-03-2021
                        modal.find('.modal-body #program_element_change_order_schedule_impact').val(g_selectedProgramElementChangeOrder.ScheduleImpact); // Jignesh-24-03-2021
                        $('#divChangeOrderAmount').show();
                        $('#divDurationDate').show();
                    }
                    //==========================================================================================================
                }
                else {	//create new
                    //luan Jquery - luan here
                    console.log('applied jquery');

                    _Is_Program_Element_Change_Order_New = true;
                    modal.find('.modal-title').text('Project Change Order');//Manasi Change title from Program Element Change Order to Project Change Order 
                    modal.find('.modal-body #program_element_change_order_name_modal').val('');
                    modal.find('.modal-body #program_element_change_order_schedule_impact').val('');
                    modal.find('.modal-body #program_element_change_order_number_modal').val('');
                    modal.find('.modal-body #program_element_change_order_amount_modal').val('');
                    modal.find('.modal-body #program_element_change_order_schedule_change_modal').val('');
                    modal.find('.modal-body #program_element_change_order_Reason_modal').val('');
                    modal.find('.modal-body #ChangeOrderType').val('0');
                    modal.find('.modal-body #ChangeOrderDate').val('');
                    modal.find('.modal-body #program_element_change_order_duration_date').val('');
                }
            });

            // DELETE PROGRAM ELEMENT CHANGE ORDER MODAL LEGACY

            $('#delete_program_element_change_order_modal').unbind().on('click', function (event) {  //Manasi
                dhtmlx.confirm("Are you sure you want to delete?", function (result) {
                    //console.log(result);
                    if (result) {
                        var obj = {
                            "Operation": 3,
                            "ChangeOrderID": g_selectedProgramElementChangeOrder.ChangeOrderID,
                            "ChangeOrderName": g_selectedProgramElementChangeOrder.ChangeOrderName,
                            "ChangeOrderNumber": g_selectedProgramElementChangeOrder.ChangeOrderNumber,
                            "ChangeOrderAmount": g_selectedProgramElementChangeOrder.ChangeOrderAmount,
                            "ChangeOrderScheduleChange": g_selectedProgramElementChangeOrder.ChangeOrderScheduleChange,
                            "ProgramElementID": wbsTree.getSelectedProgramElementID(),
                        }

                        var listToSave = [];
                        listToSave.push(obj);

                        wbsTree.getUpdateChangeOrder({ ProjectID: 1 }).save(listToSave,
                            function (response) {
                                if (response.result.split(',')[0].trim() === "Success") {
                                    //$('#ProgramModal').modal('hide');

                                } else {
                                    dhtmlx.alert({ text: response.result, width: '500px' });
                                    $('#ProgramElementChangeOrderModal').modal('hide');
                                    $("#ProgramElementModal").css({ "opacity": "1" });
                                }
                                populateProgramElementChangeOrderTable(wbsTree.getSelectedProgramElementID());

                            });
                        g_selectedProgramElementChangeOrder = null; 	//Manasi
                    }
                });
            });

            // Old Code For Delete Change order commented by pritesh on 11 jun 2020
            //$('#delete_program_element_change_order_modal').click(function () {
            //    dhtmlx.confirm({
            //        type: "confirm-warning",
            //        text: "Are you sure you want to delete?",
            //        callback: function (accept) {
            //            var obj = {
            //                "Operation": 3,
            //                "ChangeOrderID": g_selectedProgramElementChangeOrder.ChangeOrderID,
            //                "ChangeOrderName": g_selectedProgramElementChangeOrder.ChangeOrderName,
            //                "ChangeOrderNumber": g_selectedProgramElementChangeOrder.ChangeOrderNumber,
            //                "ChangeOrderAmount": g_selectedProgramElementChangeOrder.ChangeOrderAmount,
            //                "ChangeOrderScheduleChange": g_selectedProgramElementChangeOrder.ChangeOrderScheduleChange,
            //                "ProgramElementID": wbsTree.getSelectedProgramElementID(),
            //            }

            //            var listToSave = [];
            //            listToSave.push(obj);

            //            wbsTree.getUpdateChangeOrder({ ProjectID: 1 }).save(listToSave,
            //                function (response) {
            //                    if (response.result.split(',')[0].trim() === "Success") {
            //                        //$('#ProgramModal').modal('hide');

            //                    } else {
            //                        dhtmlx.alert({ text: response.result, width: '500px' });
            //                        $('#ProgramElementChangeOrderModal').modal('hide');
            //                        $("#ProgramElementModal").css({ "opacity": "1" });
            //                    }
            //                    populateProgramElementChangeOrderTable(wbsTree.getSelectedProgramElementID());

            //                });
            //        }
            //    });
            //});

            // CLICK PROGRAM ELEMENT CHANGE ORDER TABLE ROW LEGACY
            $('#program_element_change_order_table_id').on('click', '.clickable-row', function (event) {
                var foundProgramElementChangeOrder = {};

                if (g_newProgramElement) {
                    console.log(g_program_element_change_order_draft_list);
                    for (var x = 0; x < g_program_element_change_order_draft_list.length; x++) {
                        if (g_program_element_change_order_draft_list[x].ChangeOrderName == this.id) {
                            foundProgramElementChangeOrder = g_program_element_change_order_draft_list[x];
                            g_selectedProgramElementChangeOrder = foundProgramElementChangeOrder;
                            wbsTree.setSelectedProgramElementChangeOrder(foundProgramElementChangeOrder);
                        }
                    }
                } else {
                    //Find the program element CHANGE ORDER based on which one clicked
                    var programElementChangeOrderList = wbsTree.getChangeOrderList();
                    for (var x = 0; x < programElementChangeOrderList.length; x++) {
                        if (programElementChangeOrderList[x].ChangeOrderID == this.id) {
                            foundProgramElementChangeOrder = programElementChangeOrderList[x];
                            g_selectedProgramElementChangeOrder = foundProgramElementChangeOrder;
                            wbsTree.setSelectedProgramElementChangeOrder(foundProgramElementChangeOrder);
                        }
                    }
                }
                console.log(g_selectedProgramElementChangeOrder);

                $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_name_modal').val('');
                $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_schedule_impact').val('');
                $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_number_modal').val('');
                $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_amount_modal').val('');
                $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_schedule_change_modal').val('');
                $(this).addClass('active').siblings().removeClass('active');
            });

            // CLICK ADD PROGRAM ELEMENT CHANGE ORDER LEGACY
            $('#new_program_element_change_order').unbind().on('click', function (event) {
                g_newProgramElementChangeOrder = true;
                $('#ProgramElementChangeOrderModal').modal({ show: true, backdrop: 'static' });
                $('#delete_program_element_change_order_modal').hide();
                $('#uploadBtnProgramElementChangeOrderModal').prop("disabled", false);
                $("#ChangeOrderDate").datepicker();
                $('#divChangeOrderAmount').show();
                $('#divDurationDate').hide();
                //============================= Jignesh-ChangeOrderPopUpChanges ============================================
                $("#program_element_change_order_duration_date").datepicker();
                var angularHttp = wbsTree.getAngularHttp();
                angularHttp.get(serviceBasePath + 'Request/GetModificationTypes').then(function (response) {
                    modificationTypeData = response.data.result;
                    var modificationTypeDropDown = $('#ProgramElementChangeOrderModal').find('.modal-body #program_element_change_order_ddModificationType');
                    modificationTypeDropDown.empty();

                    for (var x = 0; x < modificationTypeData.length; x++) {
                        if (modificationTypeData[x].ModificationTypeId == 1) {
                            modificationTypeDropDown.append('<option value="' + modificationTypeData[x].ModificationTypeId + '" selected> ' + modificationTypeData[x].ModType + '</option>');
                            modificationTypeDropDown.val(modificationTypeData[x].ModificationTypeId);
                        } else {
                            modificationTypeDropDown.append('<option value="' + modificationTypeData[x].ModificationTypeId + '"> ' + modificationTypeData[x].ModType + '</option>');
                        }
                    }

                });
                //==========================================================================================================

                document.getElementById("fileUploadProgramElementChangeOrderModal").value = '';
                g_selectedProgramElementChangeOrder = {
                    ChangeOrderID: 0,
                    ChangeOrderName: '',
                    ChangeOrderNumber: '',
                    ChangeOrderAmount: '',
                    ChangeOrderScheduleChange: '',
                    ProgramElementID: 0,
                    OrderType: '',
                    OrderDate: '',
                }
            });
            //============================= Jignesh-ChangeOrderPopUpChanges ============================================
            $('#program_element_change_order_ddModificationType').on('change', function () {
                var ddValue = $('#program_element_change_order_ddModificationType').val();
                if (ddValue == 1) {
                    $('#program_element_change_order_amount_modal').val('');//
                    $('#divChangeOrderAmount').show();
                    $('#divDurationDate').hide();
                }
                else if (ddValue == 2) {
                    $('#program_element_change_order_amount_modal').val('');
                    //$('#program_element_change_order_duration_date').val('');
                    $('#program_element_change_order_schedule_impact').val('');
                    $('#divChangeOrderAmount').hide();
                    $('#divDurationDate').show();
                }
                else if (ddValue == 3) {
                    $('#program_element_change_order_amount_modal').val('');
                    //$('#program_element_change_order_duration_date').val('');
                    $('#program_element_change_order_schedule_impact').val('');
                    $('#divChangeOrderAmount').show();
                    $('#divDurationDate').show();
                }
            });
            //==========================================================================================================
            // CLICK EDIT PROGRAM ELEMENT CHANGE ORDER LEGACY
            $('#edit_program_element_change_order').unbind().on('click', function (event) {
                $('#uploadBtnProgramelmtCOspinRow').hide();     //Manasi 
                g_newProgramElementChangeOrder = false;
                $('#delete_program_contract_modal').show();
                $('#uploadBtnProgramElementChangeOrderModal').prop("disabled", false);
                if ((g_selectedProgramElementChangeOrder == undefined || g_selectedProgramElementChangeOrder == null)) {
                    g_selectedProgramElementChangeOrder = { ChangeOrderID: 0 };
                }

                if (g_selectedProgramElementChangeOrder.ChangeOrderID <= 0) {
                    dhtmlx.alert('Must select a change order first');
                    return;
                }
                console.log(g_selectedProgramElementChangeOrder);
                $('#fileUploadProgramElementChangeOrderModal').val(''); // Jignesh-01-03-2021
                $('#ProgramElementChangeOrderModal').modal({ show: true, backdrop: 'static' });
                $('#delete_program_element_change_order_modal').show();
                $("#ChangeOrderDate").datepicker();
                $("#program_element_change_order_duration_date").datepicker(); //  Jignesh-ChangeOrderPopUpChanges
                $("input:radio[name='rbChangeOrder']").each(function (i) {
                    this.checked = false;
                });

                $("#downloadBtnChangeOrder").attr('disabled', 'disabled');
                $("#ViewUploadFileChangeOrder").attr('disabled', 'disabled');
               // $("#edit_program_element_change_order").attr('disabled', 'disabled');
            });

            //Manasi
            $('#cancel_program_element_change_order_modal').click(function () {
                var rowId = g_selectedProgramElementChangeOrder.ChangeOrderID;
                if (rowId === undefined || rowId === null) {
                    rowId = g_selectedProgramElementChangeOrder.ChangeOrderName;
                }
                var tr = document.getElementById(rowId)
                $(tr).removeClass('active');
                g_selectedProgramElementChangeOrder = null; 	//Manasi
            });

            $('#cancel_program_element_change_order_modal_x').click(function () {
                var rowId = g_selectedProgramElementChangeOrder.ChangeOrderID;
                if (rowId === undefined || rowId === null) {
                    rowId = g_selectedProgramElementChangeOrder.ChangeOrderName;
                }
                var tr = document.getElementById(rowId)
                $(tr).removeClass('active');
                g_selectedProgramElementChangeOrder = null; 	//Manasi
            });
            //====================================== Created By Jignesh 28-10-2020 =======================================
            $('#program_contract_value').on('change', function () {
                isFieldValueChanged = true;
                var totalModification = $('#total_modification').val().replace("$", "");
                var ogContractValue = $('#program_contract_value').val().replace("$", "").replaceAll(",", "");
                var totalContractValue = parseFloat(ogContractValue) + parseFloat(totalModification);
                $('#current_contract_value').val(totalContractValue);
                $('#current_contract_value').focus(); // Jignesh 01-12-2020
                $('#current_contract_value').blur(); // Jignesh 01-12-2020
            });
            //============================================================================================================
            //===================================================================================== PROGRAM ELEMENT CHANGE ORDER END ===================================================================
            //program modal show   1 Pritesh Pop up  For Contract
            //============ Jignesh-24-03-2021 Modification Changes (Added Schedule Impact and removed Duration Date) ============
            //================  Find Schedule Impact changes respectivly ========================================================
            $('#ProgramModal').unbind().on('show.bs.modal', function (event) {
                $('#message_div').hide();
                defaultModalPosition();


                var fundToBeAdded = wbsTree.getFundToBeAdded();
                var categoryTobeAdded = wbsTree.getCategoryToBeAdded();
                var filter = wbsTree.getFilter();
                var scope = wbsTree.getScope();
                var selectedNode = wbsTree.getSelectedNode();
                var fundList = wbsTree.getFundTypeList();
                var fundName;
                var fundTable = $("#fundTable").find('.fund');

                var categoryTable = $('#categoryTable').find('.budget-category');
                categoryTable.empty();
                var phaseCodeList = wbsTree.getPhaseCodeList();
                var mainCategoryList = wbsTree.getMainCategoryList();
                var phaseId = null;
                console.debug(mainCategoryList);
                modal = $(this);
                modal.find('.modal-body #program_name').focus();
                $('#fundSelect').append($('<option></option>').val('').html("Select a Fund"));






                //Enable upload button for edit Project
                var uploadBtnProgram = modal.find('.modal-body #uploadBtnProgram');
                uploadBtnProgram.attr('disabled', false);

                // Disable File Upload Delete and View button
                $('#DeleteUploadProgram').attr('disabled', 'disabled');
                $('#ViewUploadFileProgram').attr('disabled', 'disabled');
                $('#EditBtnProgram').attr('disabled', 'disabled');
                $('#downloadBtnProgram').attr('disabled', 'disabled');   //Manasi
                $('#updateBtnProgram').removeAttr('disabled');   //Manasi

                //Load Document Grid
                var gridUploadedDocument = $("#gridUploadedDocumentProgramNew tbody")// modal.find('.modal-body #gridUploadedDocument tbody');
                gridUploadedDocument.empty();


                //$('#program_name').on('keydown',function(){
                //    $('#message_div').show();
                //   var len = $(this).val().length;
                //    if(len > 60) {
                //        $('#program_name_message').show();
                //        $('#program_name_message').text("Program Name cannot exceed 60 characters");
                //    }else{
                //        $('#program_name_message').hide();
                //    }
                //});
                //Fill Select fields 
                fillFundList(fundList);

                //luan here - no more funding source, fund allocation
                //if (fundList.length === 0) {
                //    dhtmlx.alert("Fund Allocation not setup. Please have admin to add funds for this organization in 'Funding Soure'.");
                //}

                // fillPhaseList(phaseCodeList);
                //fillMainCategoryList(mainCategoryList);
                //   getSubBudgetCategory();

                if (selectedNode.level == "Program") {
                    modal_mode = 'Update';
                    wbsTree.setIsProgramNew(false);
                    _Is_Program_New = false;
                    populateContractTable(selectedNode.ProgramID);
                    console.log("contract detailss===");
                    console.log(selectedNode);

                    g_newProgram = false;
                    g_selectedContract = {
                        ContractID: 0,
                        ProgramID: 0,
                        ContractStartDate: '',
                        ContractEndDate: '',
                        ProjectClassID: 0
                    }
                    $('#new_program_contract').prop("disabled", false);
                    $('#edit_program_contract').prop("disabled", false);
                    $('#btnModification').removeAttr('disabled');   //Manasi 23-02-2021
                    $('#spnBtnModification').removeAttr('title');   //Manasi 23-02-2021
                    $('#documentUploadProgramNew').removeAttr('title');  //Manasi 23-02-2021

                    $('#delete_program').removeAttr('disabled');  //Manasi 24-02-2021
                    $('#spnBtndelete_program').removeAttr('title');  //Manasi 24-02-2021

                    //================ Jignesh-23-02-2021 =====================
                    $('#delete_program').removeAttr('disabled');
                    $('#btnModification').removeAttr('disabled');
                    //=========================================================

                    //luan Jquery - luan here
                    //$('#program_project_class').prop('disabled', true);
                    $("#program_current_start_date").datepicker();	//datepicker - program
                    $("#program_current_end_date").datepicker();	//datepicker - program
                    $("#modification_date").datepicker(); // Jignesh 28-10-2020

                    //=============== Jignesh-24-03-2021 Modification Changes ==========================
                    //$('#duration_date').datepicker("destroy");
                    //$('#duration_date').datepicker({
                    //    minDate: new Date(moment(selectedNode.CurrentStartDate).format('MM/DD/YYYY'))
                    //});
                    //=============================================================
                    console.log('applied jquery');
                    console.log(selectedNode);

                    //Amruta
                    console.log("Client ddupdate=====>");
                    //modal = $(this);
                    var clientDropDown = modal.find('.modal-body #program_client_poc');
                    var clientList = wbsTree.getClientList();
                    // clientDropDown.empty();

                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientName == null) {
                            continue;
                        }
                        clientDropDown.append('<option value=' + clientList[x].ClientID + '>' + clientList[x].ClientName + '</option>');
                        clientDropDown.val(selectedNode.ClientID);
                    }

                    var total = appendFundAndReturnTotal(selectedNode, fundTable);
                    // appendCategory(selectedNode,categoryTable);
                    modal.find('.modal-body #total').html(filter('currency')(total, '$', 0));
                    modal.find('.modal-title').text('Contract: ' + selectedNode.name);
                    modal.find('.modal-body #program_name').val(selectedNode.name);
                    modal.find('.modal-body #program_manager').val(selectedNode.ProgramManager);
                    modal.find('.modal-body #program_sponsor').val(selectedNode.ProgramSponsor);
                    //modal.find('.modal-body #program_client_poc').val(selectedNode.ClientPOC);
                    modal.find('.modal-body #program_client_phone').val(selectedNode.ClientPhone);
                    modal.find('.modal-body #program_client_email').val(selectedNode.ClientEmail);
                    //==================== Jignesh-AddAddressField-21-01-2021 ==========================
                    //modal.find('.modal-body #program_client_address').val(selectedNode.ClientAddress);
                    modal.find('.modal-body #program_client_address_line1').val(selectedNode.ClientAddressLine1);
                    modal.find('.modal-body #program_client_address_line2').val(selectedNode.ClientAddressLine2);
                    modal.find('.modal-body #program_client_city').val(selectedNode.ClientCity);
                    modal.find('.modal-body #program_client_state').val(selectedNode.ClientState);
                    modal.find('.modal-body #program_client_po_num').val(selectedNode.ClientPONo);
                    //===================================================================================
                    modal.find('.modal-body #program_contract_number').val(selectedNode.ContractNumber);
                    modal.find('.modal-body #program_contract_name').val(selectedNode.ProgramName);
                    modal.find('.modal-body #program_contract_start_date').val(selectedNode.CurrentStartDate);
                    modal.find('.modal-body #program_contract_end_date').val(selectedNode.CurrentEndDate);
                    modal.find('.modal-body #program_current_start_date').val(selectedNode.CurrentStartDate ? moment(selectedNode.CurrentStartDate).format('MM/DD/YYYY') : ""); // Jignesh-02-03-2021
                    modal.find('.modal-body #program_current_end_date').val(selectedNode.CurrentEndDate ? moment(selectedNode.CurrentEndDate).format('MM/DD/YYYY') : ""); // Jignesh-02-03-2021
                    modal.find('.modal-body #program_contract_value').val(selectedNode.ContractValue);   //Manasi 14-07-2020
                    modal.find('.modal-body #job_number').val(selectedNode.JobNumber);   //Manasi 04-08-2020

                    modal.find('.modal-body #program_project_manager').val(selectedNode.ProjectManager);
                    modal.find('.modal-body #program_project_manager_phone').val(selectedNode.ProjectManagerPhone);
                    modal.find('.modal-body #program_project_manager_email').val(selectedNode.ProjectManagerEmail);

                    modal.find('.modal-body #program_billing_poc').val(selectedNode.BillingPOC);
                    modal.find('.modal-body #program_billing_poc_phone_1').val(selectedNode.BillingPOCPhone1);
                    modal.find('.modal-body #program_billing_poc_phone_2').val(selectedNode.BillingPOCPhone2);
                    modal.find('.modal-body #program_billing_poc_email').val(selectedNode.BillingPOCEmail);
                    //===================== Jignesh-AddAddressField-21-01-2021 =================================
                    //modal.find('.modal-body #program_billing_poc_address').val(selectedNode.BillingPOCAddress);
                    modal.find('.modal-body #program_billing_poc_address_line1').val(selectedNode.BillingPOCAddressLine1);
                    modal.find('.modal-body #program_billing_poc_address_line2').val(selectedNode.BillingPOCAddressLine2);
                    modal.find('.modal-body #program_billing_poc_city').val(selectedNode.BillingPOCCity);
                    modal.find('.modal-body #program_billing_poc_state').val(selectedNode.BillingPOCState);
                    modal.find('.modal-body #program_billing_poc_po_num').val(selectedNode.BillingPOCPONo);
                    //===========================================================================================
                    //modal.find('.modal-body #program_billing_poc_special_instruction').val(selectedNode.BillingPOCSpecialInstruction.replace('u000a', '\r\n'));
                    modal.find('.modal-body #program_billing_poc_special_instruction').val(selectedNode.BillingPOCSpecialInstruction ? selectedNode.BillingPOCSpecialInstruction.replace('u000a', '\r\n') : '');

                    // Check
                    document.getElementById("program_tm_billing").checked = selectedNode.TMBilling ? true : false;
                    document.getElementById("program_sov_billing").checked = selectedNode.SOVBilling ? true : false;
                    document.getElementById("program_monthly_billing").checked = selectedNode.MonthlyBilling ? true : false;
                    document.getElementById("program_Lumpsum").checked = selectedNode.Lumpsum ? true : false;
                    document.getElementById("program_certified_payroll").checked = selectedNode.CertifiedPayroll ? true : false;

                    modal.find('.modal-body #cost_description').val(selectedNode.CostDescription);
                    modal.find('.modal-body #schedule_description').val(selectedNode.ScheduleDescription);
                    modal.find('.modal-body #scope_quality_description').val(selectedNode.ScopeQualityDescription);
                    wbsTree.getProjectMap().setCoordinates(selectedNode.LatLong);


                    //Load Document Grid
                    var gridUploadedDocumentProgram = $("#gridUploadedDocumentProgramNew tbody")// modal.find('.modal-body #gridUploadedDocumentProgram tbody');
                    gridUploadedDocumentProgram.empty();
                    //======================= Jignesh-25-02-2021 Replace the entire block of code ===================================
                    _Document.getDocumentByProjID().get({ DocumentSet: 'Program', ProjectID: _selectedProgramID }, function (response) {
                        //wbsTree.setDocumentList(response.result);
                        var _documentList = response.result;
                        _Document.getModificationByProgramId().get({ programId: wbsTree.getSelectedProgramID() }, function (response) {
                            var _modificationList = response.data;
                            var moda2 = $('#ProgramModal');
                            var gridUploadedContDocument = moda2.find("#gridUploadedDocumentProgramNew tbody");
                            gridUploadedContDocument.empty();
                            for (var x = 0; x < _documentList.length; x++) {
                                var modificatioTitle = "";
                                for (var i = 0; i < _modificationList.length; i++) {
                                    if (_documentList[x].ModificationNumber == _modificationList[i].ModificationNo) {
                                        modificatioTitle = _modificationList[i].ModificationNo + ' - ' + _modificationList[i].Title
                                    }
                                }
                                gridUploadedContDocument.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                    // '<input type="radio" group="prgrb" name="record">' +
                                    '<input id=rb' + _documentList[x].DocumentID + ' type="radio" name="rbCategories" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                                    '</td > <td ' +
                                    'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '>' + _documentList[x].DocumentTypeName + '</td>' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '>' + modificatioTitle + '</td>' +
                                    '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                    '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                    '<tr > ');   //MM/DD/YYYY h:mm a'

                            }
                            $('input[name=rbCategories]').on('click', function (event) {
                                if (wbsTree.getLocalStorage().acl[0] == 1 && wbsTree.getLocalStorage().acl[1] == 0) {
                                    $('#ViewUploadFileProgram').removeAttr('disabled');
                                    $('#EditBtnProgram').removeAttr('disabled');
                                }
                                else {
                                    $('#DeleteUploadProgram').removeAttr('disabled');
                                    $('#ViewUploadFileProgram').removeAttr('disabled');
                                    $('#EditBtnProgram').removeAttr('disabled');
                                    $('#downloadBtnProgram').removeAttr('disabled');
                                }
                                localStorage.selectedProjectDocument = $(this).closest("tr").find(".docId").text();
                                //g_selectedProjectDocument = null;
                                //g_selectedProjectDocument = $(this).closest("tr").find(".docId").text();
                            });
                        });

                    });
                    //===================================================================================================================

                    //------------------------------ Swapnil document management contract level -------------

                    $('#ViewUploadFileInViewAllContracts').attr('disabled', 'disabled');
                    $('#downloadBtnInViewAllContracts').attr('disabled', 'disabled');
                    var gridViewAllUploadedDocumentProgram = $("#gridViewAllDocumentInContract")// Jignesh-SearchField-05022021
                    gridViewAllUploadedDocumentProgram.empty();
                    _Document.getDocumentByProjID().get({ DocumentSet: 'ContractViewAll', ProjectID: _selectedProgramID }, function (response) {
                        wbsTree.setDocumentList(response.result);
                        for (var x = 0; x < _documentList.length; x++) {


                            gridViewAllUploadedDocumentProgram.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                // '<input type="radio" group="prgrb" name="record">' +
                                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategories" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                                '</td > <td ' +
                                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ProjectElementName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ChangeOrderName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ProjectName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].TrendName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].DocumentTypeName + '</td>' +
                                '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                '<tr > ');   //MM/DD/YYYY h:mm a'

                        }

                        $('input[name=rbCategories]').on('click', function (event) {
                            if (wbsTree.getLocalStorage().acl[0] == 1 && wbsTree.getLocalStorage().acl[1] == 0) {
                                $('#ViewUploadFileInViewAllContracts').removeAttr('disabled');
                            }
                            else {
                                $('#ViewUploadFileInViewAllContracts').removeAttr('disabled');
                                $('#downloadBtnInViewAllContracts').removeAttr('disabled');
                            }

                        });
                        //============================ Jignesh-SearchField-05022021 ================================
                        var $rows = $('#gridViewAllDocumentInContract tr');
                        $('#searchCont').keyup(function () { // Jignesh-08-02-2021
                            var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                            $rows.show().filter(function () {
                                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                                return !~text.indexOf(val);
                            }).hide();
                        });
                        //==========================================================================================
                    });

                    //====================================== Created By Jignesh 28-10-2020 =======================================

                    _Document.getModificationByProgramId().get({ programId: wbsTree.getSelectedProgramID() }, function (response) {
                        _ModificationList = response.data;
                        var totalValue = 0;
                        var totalDaysOfScheduleImpact = 0;
                        var updatedContractEndDate = "";
                        var mod2 = _ModificationList.reverse();
                        for (var x = 1; x < mod2.length; x++) {
                            if (_ModificationList[x].Id != 0 && _ModificationList[x].Id != null) {
                                totalValue = totalValue + parseFloat(_ModificationList[x].Value.replace(/,/g, ''));
                            }
                            totalDaysOfScheduleImpact = totalDaysOfScheduleImpact + parseInt(_ModificationList[x].ScheduleImpact);
                            //if (_ModificationList[x].DurationDate != "" && _ModificationList[x].DurationDate != null) {
                            //    updatedContractEndDate = _ModificationList[x].DurationDate;
                            //}
                        }
                        $('#total_modification').val('$' + totalValue);
                        //$('#total_modification').focus(); // Jignesh-ModificationPopUpChanges
                        //$('#total_modification').blur(); // Jignesh-ModificationPopUpChanges
                        var ogContractValue = $('#program_contract_value').val().replace("$", "").replaceAll(",", "");
                        var totalContractValue = parseFloat(ogContractValue) + totalValue;
                        $('#current_contract_value').val("$" + totalContractValue);
                        $('#current_contract_value').focus(); // Jignesh 01-12-2020
                        $('#current_contract_value').blur(); // Jignesh 01-12-2020
                        modal.find('.modal-body #program_current_end_date').val(selectedNode.CurrentEndDate ? moment(selectedNode.CurrentEndDate).add(totalDaysOfScheduleImpact, 'days').format('MM/DD/YYYY') : "");
                        //if (updatedContractEndDate != "" && updatedContractEndDate != null && updatedContractEndDate != undefined) {
                        //    modal.find('.modal-body #program_current_end_date').val(updatedContractEndDate ? moment(updatedContractEndDate).format('MM/DD/YYYY') : ""); // Jignesh-02-03-2021
                        //}
                        //else {
                        //    modal.find('.modal-body #program_current_end_date').val(selectedNode.CurrentEndDate ? moment(selectedNode.CurrentEndDate).format('MM/DD/YYYY') : ""); // Jignesh-02-03-2021
                        //}
                    });

                    //============================================================================================================


                    //Populate program project classes for dropdown
                    //Find the program project class name given the id
                    var projectClassDropDown = modal.find('.modal-body #program_project_class');
                    var projectClassList = wbsTree.getProjectClassList();
                    var projectClassName = '';
                    projectClassDropDown.empty();

                    for (var x = 0; x < projectClassList.length; x++) {
                        if (projectClassList[x].ProjectClassID == selectedNode.ProjectClassID) {
                            projectClassName = projectClassList[x].ProjectClassName
                        }

                        if (projectClassList[x].ProjectClassName == null) {
                            continue;
                        }
                        projectClassDropDown.append('<option selected="false">' + projectClassList[x].ProjectClassName + '</option>');
                    }
                    console.log(selectedNode, projectClassName);
                    projectClassDropDown.val(projectClassName);   //Manasi 13-07-2020

                    //Populate employees for dropdown
                    //Find the employee name given the id
                    var programManagerDropDown = modal.find('.modal-body #program_manager_id');
                    var programSponsorDropDown = modal.find('.modal-body #program_sponsor_id');

                    var employeeList = wbsTree.getEmployeeList();

                    var programManagerName = '';
                    var programSponsorName = '';

                    programManagerDropDown.empty();
                    programSponsorDropDown.empty();

                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].ID == selectedNode.ProgramManagerID) {    //Program manager
                            programManagerName = employeeList[x].Name;
                        }
                        if (employeeList[x].ID == selectedNode.ProgramSponsorID) {    //Program Sponsor
                            programSponsorName = employeeList[x].Name;
                        }

                        if (employeeList[x].Name == null) { //universal
                            continue;
                        }

                        programManagerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                        programSponsorDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    }
                    programManagerDropDown.val(programManagerName);
                    programSponsorDropDown.val(programSponsorName);
                }
                else {
                    $('#btnModification').attr('disabled', 'disabled');   //Manasi 23-02-2021
                    $('#spnBtnModification').attr('title', "A contract needs to be saved before the modifications can be added");   //Manasi 23-02-2021
                    $('#documentUploadProgramNew').attr('title', "A contract needs to be saved before the document can be added");  //Manasi 23-02-2021

                    $('#delete_program').attr('disabled', 'disabled');   //Manasi 24-02-2021
                    $('#spnBtndelete_program').attr('title', "A contract needs to be saved before it can be deleted");   //Manasi 24-02-2021

                    modal_mode = 'Create';
                    wbsTree.setIsProgramNew(true);
                    _Is_Program_New = true;
                    g_newProgram = true;

                    populateContractTableNew();


                    $('#gridUploadedDocumentProgramNew tbody').empty();
                    $('#gridUploadedDocumentProgramNew > tbody').html("");

                    //Amruta
                    console.log("Client dd=====>");
                    //modal = $(this);
                    var clientDropDown = modal.find('.modal-body #program_client_poc');
                    var clientList = wbsTree.getClientList();
                    // clientDropDown.empty();

                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientName == null) {
                            continue;
                        }
                        clientDropDown.append('<option value=' + clientList[x].ClientID + '>' + clientList[x].ClientName + '</option>');
                        clientDropDown.val(selectedNode.ClientID);
                    }

                    g_selectedContract = {
                        ContractID: 0,
                        ProgramID: 0,
                        ContractStartDate: '',
                        ContractEndDate: '',
                        ProjectClassID: 0
                    }
                    //$('#new_program_contract').prop("disabled", true);
                    //$('#edit_program_contract').prop("disabled", true);

                    //luan Jquery - luan here
                    $("#program_current_start_date").datepicker();	//datepicker - program
                    $("#program_current_end_date").datepicker();	//datepicker - program
                    //$('#program_project_class').prop('disabled', false);
                    console.log('applied jquery');

                    $('#updateBtnProgram').attr('disabled', 'disabled');   //Manasi
                    //================ Jignesh-23-02-2021 =====================
                    $('#delete_program').attr('disabled', 'disabled');
                    $('#btnModification').attr('disabled', 'disabled');
                    //=========================================================
                    modal.find('.modal-title').text('New Contract');
                    modal.find('.modal-body #program_name').val('');
                    modal.find('.modal-body #program_manager').val('');
                    modal.find('.modal-body #program_sponsor').val('');
                    modal.find('.modal-body #program_client_poc').val('');
                    modal.find('.modal-body #program_client_phone').val('');
                    modal.find('.modal-body #program_client_email').val('');
                    //==================== Jignesh-AddAddressField-21-01-2021 ==========================
                    //modal.find('.modal-body #program_client_address').val('');
                    modal.find('.modal-body #program_client_address_line1').val('');
                    modal.find('.modal-body #program_client_address_line2').val('');
                    modal.find('.modal-body #program_client_city').val('');
                    modal.find('.modal-body #program_client_state').val('');
                    modal.find('.modal-body #program_client_po_num').val('');
                    //===================================================================================

                    modal.find('.modal-body #program_contract_number').val('');
                    modal.find('.modal-body #program_contract_name').val('');
                    modal.find('.modal-body #program_contract_start_date').val('');
                    modal.find('.modal-body #program_contract_end_date').val('');
                    modal.find('.modal-body #program_current_start_date').val('');
                    modal.find('.modal-body #program_current_end_date').val('');
                    modal.find('.modal-body #program_contract_project_class').val('');
                    modal.find('.modal-body #program_contract_value').val('');   //Manasi 14-07-2020
                    modal.find('.modal-body #total_modification').val('0'); //Jignesh 12-11-2020
                    modal.find('.modal-body #current_contract_value').val(''); // Jignesh 23-11-2020



                    modal.find('.modal-body #program_project_manager').val('');
                    modal.find('.modal-body #program_project_manager_phone').val('');
                    modal.find('.modal-body #program_project_manager_email').val('');

                    modal.find('.modal-body #program_billing_poc').val('');
                    modal.find('.modal-body #program_billing_poc_phone_1').val('');
                    modal.find('.modal-body #program_billing_poc_phone_2').val('');
                    modal.find('.modal-body #program_billing_poc_email').val('');
                    //===================== Jignesh-AddAddressField-21-01-2021 =================================
                    //modal.find('.modal-body #program_billing_poc_address').val('');
                    modal.find('.modal-body #program_billing_poc_address_line1').val('');
                    modal.find('.modal-body #program_billing_poc_address_line2').val('');
                    modal.find('.modal-body #program_billing_poc_city').val('');
                    modal.find('.modal-body #program_billing_poc_state').val('');
                    modal.find('.modal-body #program_billing_poc_po_num').val('');
                    //===========================================================================================
                    modal.find('.modal-body #program_billing_poc_special_instruction').val('');

                    // Check
                    document.getElementById("program_tm_billing").checked = false;
                    document.getElementById("program_sov_billing").checked = false;
                    document.getElementById("program_monthly_billing").checked = false;
                    document.getElementById("program_Lumpsum").checked = false;
                    document.getElementById("program_certified_payroll").checked = false;

                    modal.find('.modal-body #cost_description').val('');
                    modal.find('.modal-body #schedule_description').val('');
                    modal.find('.modal-body #scope_quality_description').val('');
                    modal.find('.modal-body #gridDocument tbody').empty();

                    //Populate program project classes for dropdown
                    var projectClassDropDown = modal.find('.modal-body #program_project_class');
                    var projectClassList = wbsTree.getProjectClassList();
                    projectClassDropDown.empty();

                    for (var x = 0; x < projectClassList.length; x++) {
                        if (projectClassList[x].ProjectClassName == null) {
                            continue;
                        }
                        projectClassDropDown.append('<option selected="false">' + projectClassList[x].ProjectClassName + '</option>');
                        //projectClassDropDown.val('');
                        projectClassDropDown.val(projectClassList[0].ProjectClassName);
                    }

                    //Populate employees for dropdown
                    var programManagerDropDown = modal.find('.modal-body #program_manager_id');
                    var programSponsorDropDown = modal.find('.modal-body #program_sponsor_id');

                    var employeeList = wbsTree.getEmployeeList();

                    programManagerDropDown.empty();
                    programSponsorDropDown.empty();

                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == null) { //universal
                            continue;
                        }

                        programManagerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                        programSponsorDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');

                        programManagerDropDown.val('');
                        programSponsorDropDown.val('');
                    }
                }


                $('#fundSelect').change(function () {
                    var fundId = $(this).val();
                    var available = 0;
                    angular.forEach(fundList, function (item) {
                        if (item.FundTypeId === fundId) {
                            available = item.BalanceRemaining;
                            fundName = item.Fund;
                        }
                    });
                    if (available)
                        modal.find('.modal-body #availableFund').val(filter('currency')(available, '$', 0));
                    modal.find('.modal-body #assignFund').val('');
                });
                //on Phase Select
                //$('#phaseSelect').change(function(){
                //    phaseId = $(this).val();
                //    phaseId = phaseId * 1000;
                //    wbsTree.getProgramCategory().getMainActivityCategoryProgram().get({Phase : phaseId},function(response){
                //        fillMainCategoryList(response.result);
                //        wbsTree.setMainCategoryList(response.result);
                //        getSubBudgetCategory();
                //    });
                //});
                //$('#mainBudgetSelect').change(function(){
                //    getSubBudgetCategory();
                //});
                $('#assignFund').change(function () {
                    //var assignAmount = $(this).val();
                    //var availableAmount= modal.find('.modal-body #availableFund').val();
                    // var diff = parseFloat(availableAmount) - parseFloat(assignAmount);
                    // alert(diff);
                    // modal.find('.modal-body #availableFund').val(diff);
                });
                //Remove Fund
                $("table.fund").unbind('click').on('click', '.deleteRow', function (e) {
                    var total = 0;
                    var fundToBeDeleted = wbsTree.getFundToBeDeleted();
                    // var index ;
                    var row = $(this).closest('tr');
                    var rowData = row.find('td');
                    //alert(rowData[3].text());
                    if (parseFloat((rowData[3].innerHTML).replace(/[^0-9\.]+/g, "")) > 0 || parseFloat((rowData[4].innerHTML).replace(/[^0-9\.]+/g, "")) > 0) {
                        dhtmlx.alert({
                            text: "This Fund has been assigned to a project budget. It cannot be deleted",
                            width: '400px'
                        });
                        return;
                    }
                    var index = $(this).closest('tr').prevAll().length;
                    //fundToBeAdded.splice(index,1);
                    var deletedFund = fundToBeAdded[index];
                    fundToBeAdded.splice(index, 1);
                    fundToBeDeleted.push(deletedFund);

                    wbsTree.setFundToBeAdded(fundToBeAdded);
                    wbsTree.setFundToBeDeleted(fundToBeDeleted);
                    var valueToAddBack = rowData[2].textContent;
                    var fName = rowData[1].textContent;
                    row.remove();
                    $(".fundRemaining").each(function () {
                        var value = $(this).text();
                        total += parseFloat(value.replace(/[^0-9\.]+/g, ""));
                    });

                    modal.find('.modal-body #total').html(filter('currency')(total, '$', 0));
                });
                //edit


                $("table.fund").on('click', ' tbody tr', function () {

                    $(this).addClass('highlight').siblings().removeClass('highlight');
                    var row = $(this).closest('tr');
                    var rowData = row.find('td');

                    console.log(rowData);
                    var rowFundName = rowData[1].textContent;
                    var rowFundAmount = Number(rowData[2].textContent.replace(/[^0-9\.]+/g, ""));
                    angular.forEach(fundList, function (item) {
                        if (item.Fund == rowFundName) {
                            $('#fundSelect').val(item.FundTypeId);
                            //  modal.find('.modal-body #availableFund').val(item.BalanceRemaining);
                            modal.find('.modal-body #assignFund').val(filter('currency')(rowFundAmount, '$', 0));
                        }
                    })
                });

                $("#addFund").unbind('click').on('click', function () {

                    var filter = wbsTree.getFilter();

                    isExist = false;
                    var total = 0;
                    // var availableFund = modal.find('.modal-body #availableFund').val();
                    var assignFund = modal.find('.modal-body #assignFund').val();
                    assignFund = assignFund.replace(/[^0-9\.]+/g, "");
                    if (isNaN(assignFund) == true) {
                        dhtmlx.alert("Please insert a valid number");
                        return;
                    }
                    var isExist = false;
                    //  alert("HELLO1");
                    var selVal = modal.find(".modal-body #fundSelect").val();
                    angular.forEach(fundList, function (item) {
                        if (item.FundTypeId == selVal) {
                            fundName = item.Fund;
                            return;
                        }
                    });

                    if (!assignFund) {
                        dhtmlx.alert('There is no fund assigned. Please assign a fund first');
                        return;
                    }

                    //validate
                    var index;
                    $('.fundTitle').each(function () {
                        var name = $(this).text();
                        if (fundName == name) {
                            isExist = true;
                            var parent = $(this).parent();
                            index = parent.closest('tr').prevAll().length;
                            var row = parent.closest('tr');
                            var rowData = row.find('td');
                            var diff = filter('currency')(assignFund - (parseFloat(rowData[3].innerHTML.replace(/[^0-9\.]+/g, "")) + parseFloat(rowData[4].innerHTML.replace(/[^0-9\.]+/g, ""))), '$', 0);
                            var totalUsed = parseFloat(rowData[3].innerHTML.replace(/[^0-9\.]+/g, "")) + parseFloat(rowData[4].innerHTML.replace(/[^0-9\.]+/g, ""));
                            var isNeg = parseFloat(diff.replace(/[^0-9\.]+/g, "")) - totalUsed;
                            console.log(diff);
                            console.log(totalUsed);
                            console.log(isNeg);
                            if (isNeg < 0) {
                                dhtmlx.alert({
                                    text: "The assign value cannot be smaller than the total requested fund!",
                                    width: "400px"
                                });
                                return;

                            }
                            rowData[2].innerHTML = filter('currency')(assignFund, '$', 0);
                            rowData[5].innerHTML = filter('currency')(assignFund - (parseFloat(rowData[3].innerHTML.replace(/[^0-9\.]+/g, "")) + parseFloat(rowData[4].innerHTML.replace(/[^0-9\.]+/g, ""))), '$', 0);

                            fundToBeAdded[index].FundAmount = assignFund;
                            fundToBeAdded[index].FundRemaining = (rowData[5].innerHTML).replace(/[^0-9\.]+/g, "");
                            var s = wbsTree.getOrgProgramFund();
                            console.log(s);
                            wbsTree.setFundToBeAdded(fundToBeAdded);
                            //  $(this).find('.fundRemaining').html(assignFund);
                        }
                    });
                    if (isExist) {
                        $(".fundRemaining").each(function () {
                            var value = $(this).text();
                            total += parseFloat(value.replace(/[^0-9\.]+/g, ""));
                        });
                        modal.find('.modal-body #total').html(filter('currency')(total, '$', 0));
                        return;
                    }

                    fundTable.append($('<tr class="clickrow">')
                        .append(
                            $('<td  class="deleteRow"  style="width:10%;">').append($('<span class="fa fa-trash"   style="width:100%">')),
                            $('<td class="fundTitle" style="width:18%;">').append($('<label>').text(fundName)),
                            $('<td class="fundAvailable" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(assignFund, '$', 0))),
                            $('<td class="fundRequest" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(0, '$', 0))),
                            $('<td class="fundUsed" style="width:18%;text-align:right;">').append($('<label>').text(filter('c' +
                                'urrency')(0, '$', 0))),
                            $('<td class="fundRemaining" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(assignFund, '$', 0)))
                        )
                    );
                    var fundObj = {
                        "FundName": fundName,
                        "FundAmount": assignFund,
                        "FundUsed": 0,
                        "FundRequest": 0,
                        "FundRemaining": assignFund,
                        "ProgramID": '',
                        "Operation": 1

                    }

                    fundToBeAdded.push(fundObj);
                    wbsTree.setFundToBeAdded(fundToBeAdded);
                    $(".fundRemaining").each(function () {
                        var value = $(this).text();
                        total += parseFloat(value.replace(/[^0-9\.]+/g, ""));
                    });

                    modal.find('.modal-body #total').html(filter('currency')(total, '$', 0));

                });

                // Pritesh for Authorization added on 5th Aug 2020
                if (wbsTree.getLocalStorage().acl[0] == 1 && wbsTree.getLocalStorage().acl[1] == 0) {
                    $("#delete_program").attr('disabled', 'disabled');
                    $("#update_program").attr('disabled', 'disabled');
                    $("#btnSaveModification").attr('disabled', 'disabled'); // Jignesh-04-03-2021
                    $('#updateDMBtnContModification').attr('disabled', 'disabled');

                    //  $('#ProgramModal :input').attr('disabled', 'disabled');
                    $('#updateBtnProgram').attr('disabled', 'disabled');
                    $('#cancel_program').removeAttr('disabled');
                    $('#cancel_program_x').removeAttr('disabled');
                } else {
                    //$("#delete_program").removeAttr('disabled'); // Jignesh-23-02-2021
                    $("#update_program").removeAttr('disabled');
                    //  $('#ProgramModal :input').removeAttr('disabled');


                    if (selectedNode.level == "Program") {
                        $('#updateBtnProgram').removeAttr('disabled');
                    } else {
                        $('#updateBtnProgram').attr('disabled', 'disabled');
                    }

                }
            });


            function CheckedCategory(Id) {
                alert(Id);
                var Name = Id.value;
                alert(Name);
                //var ext = Name.split(".");
                $('#Aadhariframe').attr('src', Name);
                $('#PdfViewer').modal({ show: true, backdrop: 'static' });
            }
            $('#ProgramModal').on('shown.bs.modal', function () {
                //after it shows the modal, capture all the original data
                originalInfo = wbsTree.getSelectedNode();
                originalFund = wbsTree.getOrgProgramFund();
                originalCategory = wbsTree.getOrgProgramCategory();
                $('[id$=program_name]').focus();
            });
            $("#ProgramModal").on('hide.bs.modal', function (event) {
                console.log("EXITING...");
                var pr = wbsTree.getOrgProgramFund();

                //console.log(pr);
                var selectedNode = wbsTree.getSelectedNode();
                selectedNode.programFunds = pr;
                selectedNode.programCategories = wbsTree.getOrgProgramCategory();
                wbsTree.setSelectedNode(selectedNode);
                wbsTree.setFundToBeAdded(pr);
                //wbsTree.setFundTypeList([]);
                $('#fundSelect').empty();
                $('#project-map-canvas-edit').html("");
                modal.find('.modal-body #assignFund').val("");
                modal.find('.modal-body #total').html('');

                $('#fundTable .fund tbody').empty();
                $("#addFund").unbind('click');
                $('#addBudgetCategory').unbind('click');
            });


            // Click fof Pop up pritesh Upload Pop up
            $('#DocUpdateModal').unbind().on('show.bs.modal', function (event) {
                $("#ProgramModal").css({ "opacity": "0.4" });
                $("#PrgExecutionDate").datepicker();
                modal = $(this);
                //load docTypeList
                var docTypeDropDownProgram = modal.find('.modal-body #document_type_program');
                var docTypeList = wbsTree.getDocTypeList();
                docTypeDropDownProgram.empty();

                // Jignesh-25-03-2021
                if (wbsTree.getLocalStorage().role === "Admin") {
                    docTypeDropDownProgram.append('<option value="Add New"> ----------Add New---------- </option>');
                }

                if (g_editdocument == false) {
                    for (var x = 0; x < docTypeList.length; x++) {
                        docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                    }
                    docTypeDropDownProgram.val('');
                }
                else {
                    for (var x = 0; x < docTypeList.length; x++) {
                        if (docTypeList[x].DocumentTypeID == g_document_type_program) {
                            docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '" selected> ' + docTypeList[x].DocumentTypeName + '</option>');
                            docTypeDropDownProgram.val(docTypeList[x].DocumentTypeID);
                        } else {
                            docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                        }

                    }
                }


                //docTypeDropDownProgram.val('');
                //$('#PrgSpecialNote').val(''); //Manasi
                //$('#document_name_program').val(''); //Manasi
                //$('#PrgExecutionDate').val(''); //Manasi
                //$('#fileUploadProgram').val('');  //Manasi

            });



            // Upload Pop up Click of Contract
            $('#updateBtnProgram').unbind().on('click', function (event) {  //Manasi
                //$('#DocUpdateModal').modal({ show: true, backdrop: 'static' });
                g_editdocument = false;
                if (wbsTree.getIsProgramNew()) {
                    dhtmlx.alert('Uploading files only work in edit mode.');
                    return;
                }
                else {

                    $('#fileUploadProgram').val('');
                    $('#PrgSpecialNote').val('');
                    $('#document_type_program').val('');
                    $('#document_name_program').val('');

                    $('#DocUpdateModal').modal({ show: true, backdrop: 'static' });
                }
            });

            //--------------------------------Manasi------------------------------------------------
            $('#ViewUploadFileProgram').unbind().on('click', function (event) {  //Manasi
                // $('#PdfViewer').modal({ show: true, backdrop: 'static' });
                $("#Aadhariframe").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategories"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        //  alert('page content: ' + data);
                        //  $('#imgTest').attr('src', data);
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        //var base64 = data.split(';')[1];
                        //base64 = base64.split(',')[1];
                        //const blob = base64ToBlob(base64, type);
                        //const url = URL.createObjectURL(blob);
                        //$('#Aadhariframe').attr('src', url);
                        // alert(type.replace("application\",""));
                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        // alert(result);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#Aadhariframe').attr('src', url);
                            $('#PdfViewer').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );

            });



            function base64ToBlob(base64, type = "application/octet-stream") {
                const binStr = atob(base64);
                const len = binStr.length;
                const arr = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }
                return new Blob([arr], { type: type });
            }
            //--------------------------------------------------------------------------------------
            //--------------------------------Manasi------------------------------------------------

            var saveByteArray = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, name) {
                    var blob = new Blob([data], { type: "application/octet-stream;base64" }), //need the square bracket
                        url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            }());

            $('#downloadBtnProgram').unbind('click').on('click', function (event) {

                $('#updateBtnProgram').attr('disabled', 'disabled');
                $('#DeleteUploadProgram').attr('disabled', 'disabled');
                $('#ViewUploadFileProgram').attr('disabled', 'disabled');
                $('#EditBtnProgram').attr('disabled', 'disabled');
                $('#downloadBtnProgram').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategories"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");

                    $('#updateBtnProgram').removeAttr('disabled');
                    $('#DeleteUploadProgram').removeAttr('disabled');
                    $('#ViewUploadFileProgram').removeAttr('disabled');
                    $('#EditBtnProgram').removeAttr('disabled');
                    $('#downloadBtnProgram').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });
                //$http(request).then(function success(d) {

                //    byteCharacters = atob(d.data.result);
                //    byteNumbers = new Array(byteCharacters.length);
                //    for (let i = 0; i < byteCharacters.length; i++) {
                //        byteNumbers[i] = byteCharacters.charCodeAt(i);
                //    }
                //    byteArray = new Uint8Array(byteNumbers);

                //    saveByteArray(byteArray, d.data.fileName);
                //    debugger;
                //    $('#ExportToMPP').prop('disabled', false);
                //    //document.getElementById("loading").style.display = "none";
                //    dhtmlx.alert("File downloaded successfully.");
                //    return;
                //});

            });

            $('#downloadBtnProgramPrg').unbind('click').on('click', function (event) {

                $('#DeleteUploadProgramPrg').attr('disabled', 'disabled');
                $('#updateBtnProgramPrg').attr('disabled', 'disabled');
                $('#downloadBtnProgramPrg').attr('disabled', 'disabled');
                $('#ViewUploadFileProgramPrg').attr('disabled', 'disabled');
                $('#EditBtnProgramPrg').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategoriesPrg"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    debugger;
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");

                    $('#DeleteUploadProgramPrg').removeAttr('disabled');
                    $('#updateBtnProgramPrg').removeAttr('disabled');
                    $('#downloadBtnProgramPrg').removeAttr('disabled');
                    $('#ViewUploadFileProgramPrg').removeAttr('disabled');
                    $('#EditBtnProgramPrg').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });
                //$http(request).then(function success(d) {

                //    byteCharacters = atob(d.data.result);
                //    byteNumbers = new Array(byteCharacters.length);
                //    for (let i = 0; i < byteCharacters.length; i++) {
                //        byteNumbers[i] = byteCharacters.charCodeAt(i);
                //    }
                //    byteArray = new Uint8Array(byteNumbers);

                //    saveByteArray(byteArray, d.data.fileName);
                //    debugger;
                //    $('#ExportToMPP').prop('disabled', false);
                //    //document.getElementById("loading").style.display = "none";
                //    dhtmlx.alert("File downloaded successfully.");
                //    return;
                //});

            });

            $('#downloadBtnProgramPrgElm').unbind('click').on('click', function (event) {

                $('#DeleteUploadProgramPrgElm').attr('disabled', 'disabled');
                $('#updateBtnProgramPrgElm').attr('disabled', 'disabled');
                $('#downloadBtnProgramPrgElm').attr('disabled', 'disabled');
                $('#ViewUploadFileProgramPrgElm').attr('disabled', 'disabled');
                $('#EditBtnProgramPrgElm').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategoriesPrgElm"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    debugger;
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");

                    $('#DeleteUploadProgramPrgElm').removeAttr('disabled');
                    $('#updateBtnProgramPrgElm').removeAttr('disabled');
                    $('#downloadBtnProgramPrgElm').removeAttr('disabled');
                    $('#ViewUploadFileProgramPrgElm').removeAttr('disabled');
                    $('#EditBtnProgramPrgElm').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });
                //$http(request).then(function success(d) {

                //    byteCharacters = atob(d.data.result);
                //    byteNumbers = new Array(byteCharacters.length);
                //    for (let i = 0; i < byteCharacters.length; i++) {
                //        byteNumbers[i] = byteCharacters.charCodeAt(i);
                //    }
                //    byteArray = new Uint8Array(byteNumbers);

                //    saveByteArray(byteArray, d.data.fileName);
                //    debugger;
                //    $('#ExportToMPP').prop('disabled', false);
                //    //document.getElementById("loading").style.display = "none";
                //    dhtmlx.alert("File downloaded successfully.");
                //    return;
                //});

            });
            // -------------------------------- Swapnil Document management elememt level-----------------------------

            $('#downloadBtnInViewAllProgramElement').unbind('click').on('click', function (event) {


                $('#downloadBtnInViewAllProgramElement').attr('disabled', 'disabled');
                $('#ViewUploadFileInViewAllProgramElement').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategoriesPrgElm"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");

                    $('#downloadBtnInViewAllProgramElement').removeAttr('disabled');
                    $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });

            });

            //--------------------------------------------------------------------------------------

            // -------------------------------- Swapnil Document management project level-----------------------------

            $('#downloadBtnInViewAllProject').unbind('click').on('click', function (event) {


                $('#downloadBtnInViewAllProject').attr('disabled', 'disabled');
                $('#ViewUploadFileInViewAllProject').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategoriesPrg"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");

                    $('#downloadBtnInViewAllProject').removeAttr('disabled');
                    $('#ViewUploadFileInViewAllProject').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });

            });

            //--------------------------------------------------------------------------------------

            //--------------------------------Swapnil Document management contract level-----------------------------

            $('#downloadBtnInViewAllContracts').unbind('click').on('click', function (event) {


                $('#ViewUploadFileInViewAllContracts').attr('disabled', 'disabled');
                $('#downloadBtnInViewAllContracts').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategories"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");


                    $('#ViewUploadFileInViewAllContracts').removeAttr('disabled');
                    $('#downloadBtnInViewAllContracts').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });
            });

            //----------------------------------------------------------------------------

            //--------------------------------------------------------------------------------------
            //====================================== Jignesh-TDM-06-01-2020 =======================================

            $('#downloadBtnTrend').unbind('click').on('click', function (event) {

                $('#DeleteUploadTrend').attr('disabled', 'disabled');
                $('#updateDMBtnTrend').attr('disabled', 'disabled');
                $('#ViewUploadFileTrend').attr('disabled', 'disabled');
                $('#EditBtnTrend').attr('disabled', 'disabled');
                $('#downloadBtnTrend').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbCategoriesTrend"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    debugger;
                    //$('#ExportToMPP').prop('disabled', false);
                    //document.getElementById("loading").style.display = "none";
                    dhtmlx.alert("File downloaded successfully.");

                    $('#DeleteUploadTrend').removeAttr('disabled');
                    $('#updateDMBtnTrend').removeAttr('disabled');
                    $('#ViewUploadFileTrend').removeAttr('disabled');
                    $('#EditBtnTrend').removeAttr('disabled');
                    $('#downloadBtnTrend').removeAttr('disabled');
                    return;

                    //alert(d.fileName);
                });
            });

            //=========================  Jignesh-ModificationPopUpChanges =====================================================

            $('#downloadBtnContModification').unbind('click').on('click', function (event) {



                $('#updateDMBtnContModification').attr('disabled', 'disabled');
                $('#DeleteUploadContModification').attr('disabled', 'disabled');
                $('#ViewUploadFileContModification').attr('disabled', 'disabled');
                $('#downloadBtnContModification').attr('disabled', 'disabled');

                $('#documentUploadContModification').attr('title', "A modification needs to be saved before the document can be added");  //Manasi 01-03-2021

                var RbUpload = document.querySelector('input[name = "rbCategoriesMod"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                var request = serviceBasePath + 'Request/getDocument/' + documentId;

                $.get(request, function (d) {
                    byteCharacters = atob(d.result);
                    byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    byteArray = new Uint8Array(byteNumbers);

                    saveByteArray(byteArray, d.fileName);
                    dhtmlx.alert("File downloaded successfully.");

                    $('#updateDMBtnContModification').removeAttr('disabled');
                    $('#DeleteUploadContModification').removeAttr('disabled');
                    $('#ViewUploadFileContModification').removeAttr('disabled');
                    $('#downloadBtnContModification').removeAttr('disabled');

                    $('#documentUploadContModification').removeAttr('title');    //Manasi 01-03-2021
                    return;

                });

            });

            //=================  Jignesh-ModificationPopUpChanges Ends here ==================================

            $('#PdfViewer').unbind().on('show.bs.modal', function (event) {
                $("#ProgramModal").css({ "opacity": "0.4" });
            });

            $('#DeleteUploadProgram').unbind().on('click', function (event) { //off() Manasi
                dhtmlx.confirm("Delete selected document?", function (result) { // Jignesh-24-02-2021 {Remove 's' from document}
                    //console.log(result);
                    if (result) {
                        var deleteDocBtn = $('#DeleteUploadProgram');
                        deleteDocBtn.attr('disabled', true);
                        // Disable File Upload Delete and View button
                        $('#DeleteUploadProgram').attr('disabled', 'disabled');
                        $('#ViewUploadFileProgram').attr('disabled', 'disabled');
                        $('#EditBtnProgram').attr('disabled', 'disabled');
                        $('#downloadBtnProgram').attr('disabled', 'disabled');   //Manasi

                        $("#gridUploadedDocumentProgramNew tbody").find('input[name="rbCategories"]').each(function () {
                            if ($(this).is(":checked")) {
                                //alert($(this).parents("tr").attr('id'));
                                console.log($(this).parents("tr").attr('id'));
                                // alert($(this).parents("tr").attr('id'));

                                _Document.delByDocIDs()
                                    .get({ "docIDs": $(this).parents("tr").attr('id').toString() }, function (response) {
                                        console.log(response);
                                        if (response.result == "Deleted") {
                                            wbsTree.setDeleteDocIDs(null);
                                            dhtmlx.alert('File deleted successfully');
                                        } else {
                                            dhtmlx.alert('Error trying to delete Uploaded Documents.');
                                        }
                                    });
                                wbsTree.setDeleteDocIDs($(this).parents("tr").attr('id'));
                                $(this).parents("tr").remove();

                            }
                            else {
                                // deleteDocBtn.attr('disabled', false);
                            }
                        });
                    }
                });
            });
            //Program Element Modal - ON SHOW SUPER PROJECT - luan quest 3/22






            // Below for Project Pop up no 2 pritesh

            // Click for Pop up 2 pritesh Upload Pop up
            $('#DocUpdateModalPrg').unbind().on('show.bs.modal', function (event) {
                $("#ProgramElementModal").css({ "opacity": "0.4" });
                $("#PrgExecutionDatePrg").datepicker();
                modal = $(this);
                //load docTypeList
                var docTypeDropDownProgram = modal.find('.modal-body #document_type_programPrg');
                var docTypeList = wbsTree.getDocTypeList();
                docTypeDropDownProgram.empty();
                // Jignesh-25-03-2021
                if (wbsTree.getLocalStorage().role === "Admin") {
                    docTypeDropDownProgram.append('<option value="Add New"> ----------Add New---------- </option>');
                }
                if (g_editprojectdocument == false) {
                    for (var x = 0; x < docTypeList.length; x++) {
                        docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                    }
                    docTypeDropDownProgram.val('');
                }
                else {
                    for (var x = 0; x < docTypeList.length; x++) {
                        if (docTypeList[x].DocumentTypeID == g_document_type_project) {
                            docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '" selected> ' + docTypeList[x].DocumentTypeName + '</option>');
                            docTypeDropDownProgram.val(docTypeList[x].DocumentTypeID);
                        } else {
                            docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                        }
                    }

                }

                //docTypeDropDownProgram.val('');
                //$('#PrgSpecialNotePrg').val('');  //Manasi
                //$('#PrgExecutionDatePrg').val('');  //Manasi
                //$('#fileUploadProgramElement').val('');  //Manasi
                //$('#document_name_program_element').val('');
            });

            // Upload Pop up Click of Contract
            $('#updateBtnProgramPrg').unbind().on('click', function (event) {  //Manasi
                //$('#DocUpdateModalPrg').modal({ show: true, backdrop: 'static' });
                g_editprojectdocument = false;
                if (wbsTree.getIsProgramElementNew()) {
                    dhtmlx.alert('Uploading files only work in edit mode.');
                    return;
                }
                else {
                    $('#PrgSpecialNotePrg').val('');  //Manasi
                    $('#document_type_programPrg').val('');  //Manasi
                    $('#fileUploadProgramElement').val('');  //Manasi
                    $('#document_name_program_element').val('');
                    $('#DocUpdateModalPrg').modal({ show: true, backdrop: 'static' });
                }
            });

            //-----------------------Manasi-------------------------------------------------------
            $('#ViewUploadFileProgramPrg').unbind().on('click', function (event) {   //Manasi
                //  $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                $("#AadhariframePrg").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesPrg"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        //  alert('page content: ' + data);
                        //  $('#imgTest').attr('src', data);
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        //var base64 = data.split(';')[1];
                        //base64 = base64.split(',')[1];
                        //const blob = base64ToBlob(base64, type);
                        //const url = URL.createObjectURL(blob);
                        //$('#AadhariframePrg').attr('src', url);


                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframePrg').attr('src', url);
                            $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }



                    }
                );

            });
            //====================================== Jignesh-TDM-06-01-2020 =======================================
            $('#ViewUploadFileTrend').unbind().on('click', function (event) {   //Manasi
                //  $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                $("#AadhariframePrg").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesTrend"]:checked').value;

                $.get(
                    RbUpload,
                    function (data) {
                        var type = data.split(';')[0];
                        type = type.split(':')[1];

                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }
                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframeTrend').attr('src', url);
                            $('#PdfViewerTrend').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );
            });
            //====================================== Jignesh-TDM-06-01-2020 =======================================
            $('#ViewUploadFilePastTrend').unbind().on('click', function (event) {   //Manasi
                //  $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                $("#AadhariframePastTrend").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesTrend"]:checked').value;

                $.get(
                    RbUpload,
                    function (data) {
                        var type = data.split(';')[0];
                        type = type.split(':')[1];

                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }
                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframePastTrend').attr('src', url);
                            $('#PdfViewerPastTrend').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );
            });
            //=========================  Jignesh-ModificationPopUpChanges =====================================================
            $('#ViewUploadFileContModification').unbind().on('click', function (event) {  //Manasi

                $("#AadhariframeContModification").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesMod"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        for (var i = 0; i < extensions.length; i++) {
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframeContModification').attr('src', url);
                            $('#PdfViewerContModification').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );

            });
            //================================== Jignesh-08-02-2021 ================================================
            $('#gridUploadedDocumentContModification').on('click', '#viewDocumentDetail', function (event) {
                var docId = $(this).closest("tr").find(".docId").text();
                var docData = {};
                console.log(docId);
                $.each(_documentList,
                    function (i, el) {
                        if (this.DocumentID == docId) {
                            docData = _documentList[i];
                            console.log(_documentList[i]);
                        }
                    });
                $('#txtDocNameViewModelMod').val(docData.DocumentName);
                $('#txtDocTypeViewModelMod').val(docData.DocumentTypeName);
                $('#txtUploadDateViewModelMod').val(moment(docData.CreatedDate).format('MM/DD/YYYY'));
                $('#txtUploadByViewModelMod').val(docData.CreatedBy);
                $('#txtDocNoteViewModelMod').val(docData.DocumentDescription);
                $('#PdfViewerContModification22').modal({ show: true, backdrop: 'static' });
            });
            //=================  Jignesh-ModificationPopUpChanges Ends here ==================================
            function base64ToBlob(base64, type = "application/octet-stream") {
                const binStr = atob(base64);
                const len = binStr.length;
                const arr = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }
                return new Blob([arr], { type: type });
            }
            //------------------------------------------------------------------------------

            $('#PdfViewerPrg').unbind().on('show.bs.modal', function (event) {
                $("#ProgramElementModal").css({ "opacity": "0.4" });
            });

            $('#ViewUploadFileChangeOrder').unbind().on('click', function (event) {
                // $('#PdfViewerChangeorder').modal({ show: true, backdrop: 'static' });
                // $("#iFrameChangeorder").attr('src', '');
                //// var RbUpload = document.querySelector('input[name ="rbChangeOrder"]:checked').value;
                // var RbUpload = document.querySelector('input[name = "rbCategoriesPrg"]:checked').value;
                // var documentId = RbUpload.split('/')[6].trim();
                // if (documentId == 0) {
                //     dhtmlx.alert('Cannot View, As there are no document uploaded.');
                //     return;
                // } else {
                //   //  alert(RbUpload);
                //     $.get(
                //         RbUpload,
                //         function (data) {
                //             // alert('page content: ' + data);
                //             //  $('#imgTest').attr('src', data);
                //             setTimeout(function () {
                //             $('#iFrameChangeorder').attr('src', data);
                //             }, 500);
                //         }
                //     );
                // }

                //Pritesh img


                $("#AadhariframePrg").attr('src', '');
                var RbUpload = document.querySelector('input[name ="rbChangeOrder"]:checked').value;
                //  var RbUpload = document.querySelector('input[name = "rbCategoriesPrg"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                if (documentId == 0) {
                    //dhtmlx.alert('Cannot view as there are no document uploaded.');
                    dhtmlx.alert('Cannot view as document is not attached to this record.');
                    return;
                } else {
                    $.get(
                        RbUpload,
                        function (data) {
                            //  $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                            var type = data.split(';')[0];
                            type = type.split(':')[1];
                            //var base64 = data.split(';')[1];
                            //base64 = base64.split(',')[1];
                            //const blob = base64ToBlob(base64, type);
                            //const url = URL.createObjectURL(blob);
                            //$('#AadhariframePrg').attr('src', url);

                            var n = type.lastIndexOf('/');
                            var result = type.substring(n + 1);
                            var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                            var correct = false;

                            // Loop through the extension list
                            for (var i = 0; i < extensions.length; i++) {
                                // Check if the file url ends with the given extension
                                if (result == extensions[i]) {
                                    // All conditions met, set to true!
                                    correct = true;
                                }
                            }


                            if (correct) {
                                // Yay, it's correct!
                                var base64 = data.split(';')[1];
                                base64 = base64.split(',')[1];
                                const blob = base64ToBlob(base64, type);
                                const url = URL.createObjectURL(blob);
                                $('#AadhariframePrg').attr('src', url);
                                $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                            }
                            else {
                                // It's wrong, show something else!
                                dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                            }
                        }
                    );
                }
            });

            //$('#PdfViewerChangeorder').unbind().on('show.bs.modal', function (event) {
            //    $("#ProgramElementModal").css({ "opacity": "0.4" });
            //});

            $('#downloadBtnChangeOrder').unbind('click').on('click', function (event) {

                // $('#DeleteUploadProgramPrg').attr('disabled', 'disabled');
                //  $('#updateBtnProgramPrg').attr('disabled', 'disabled');
                //  $('#downloadBtnProgramPrg').attr('disabled', 'disabled');
                //  $('#ViewUploadFileProgramPrg').attr('disabled', 'disabled');

                var RbUpload = document.querySelector('input[name = "rbChangeOrder"]:checked').value;
                var documentId = RbUpload.split('/')[6].trim();
                if (documentId == 0) {
                    dhtmlx.alert('Cannot download as there is no document attached to this record.');
                    return;
                } else {
                    var request = serviceBasePath + 'Request/getDocument/' + documentId;

                    $.get(request, function (d) {
                        byteCharacters = atob(d.result);
                        byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        byteArray = new Uint8Array(byteNumbers);

                        saveByteArray(byteArray, d.fileName);
                        //$('#ExportToMPP').prop('disabled', false);
                        //document.getElementById("loading").style.display = "none";
                        dhtmlx.alert("File downloaded successfully.");

                        // $('#DeleteUploadProgramPrg').removeAttr('disabled');
                        // $('#updateBtnProgramPrg').removeAttr('disabled');
                        // $('#downloadBtnProgramPrg').removeAttr('disabled');
                        //  $('#ViewUploadFileProgramPrg').removeAttr('disabled');
                        return;

                        //alert(d.fileName);
                    });
                }
            });


            $('#DeleteUploadProgramPrg').unbind().on('click', function (event) {  //.off()  Manasi
                dhtmlx.confirm("Delete selected document?", function (result) { // Jignesh-24-02-2021 {Remove 's' from document}
                    //console.log(result);
                    if (result) {
                        //var deleteDocBtn = $('#DeleteUploadProgram');  //Manasi
                        var deleteDocBtn = $('#DeleteUploadProgramPrg');  //Manasi
                        deleteDocBtn.attr('disabled', true);

                        $('#DeleteUploadProgramPrg').attr('disabled', 'disabled');
                        $('#ViewUploadFileProgramPrg').attr('disabled', 'disabled');
                        $('#EditBtnProgramPrg').attr('disabled', 'disabled');
                        $('#downloadBtnProgramPrg').attr('disabled', 'disabled');  //Manasi

                        $("#gridUploadedDocumentProgramNewPrg tbody").find('input[name="rbCategoriesPrg"]').each(function () {
                            if ($(this).is(":checked")) {
                                //alert($(this).parents("tr").attr('id'));
                                console.log($(this).parents("tr").attr('id'));
                                // alert($(this).parents("tr").attr('id'));

                                _Document.delByDocIDs()
                                    .get({ "docIDs": $(this).parents("tr").attr('id').toString() }, function (response) {
                                        console.log(response);
                                        if (response.result == "Deleted") {
                                            wbsTree.setDeleteDocIDs(null);
                                        } else {
                                            dhtmlx.alert('Error trying to delete uploaded document.'); // Jignesh-02-03-2021
                                        }
                                    });
                                wbsTree.setDeleteDocIDs($(this).parents("tr").attr('id'));
                                $(this).parents("tr").remove();
                            }
                            else {
                                //  deleteDocBtn.attr('disabled', false);
                            }
                        });
                    }
                });
            });
            //====================================== Jignesh-TDM-06-01-2020 =======================================

            $('#DeleteUploadTrend').unbind().on('click', function (event) {  //.off()  Manasi
                dhtmlx.confirm("Delete selected document?", function (result) { // Jignesh-24-02-2021 {Remove 's' from document}
                    //console.log(result);
                    if (result) {
                        //var deleteDocBtn = $('#DeleteUploadProgram');  //Manasi
                        var deleteDocBtn = $('#DeleteUploadTrend');  //Manasi
                        deleteDocBtn.attr('disabled', true);

                        $('#DeleteUploadTrend').attr('disabled', 'disabled');
                        $('#ViewUploadFileTrend').attr('disabled', 'disabled');
                        $('#EditBtnTrend').attr('disabled', 'disabled');
                        $('#downloadBtnTrend').attr('disabled', 'disabled');

                        $("#gridUploadedDocumentTrend tbody").find('input[name="rbCategoriesTrend"]').each(function () {
                            if ($(this).is(":checked")) {
                                //alert($(this).parents("tr").attr('id'));
                                console.log($(this).parents("tr").attr('id'));
                                // alert($(this).parents("tr").attr('id'));
                                _Document.delByDocIDs()
                                    .get({ "docIDs": $(this).parents("tr").attr('id').toString() }, function (response) {
                                        console.log(response);
                                        if (response.result == "Deleted") {
                                            wbsTree.setDeleteDocIDs(null);
                                            dhtmlx.alert('Successfully uploaded document deleted.'); // Jignesh-02-03-2021
                                        } else {
                                            dhtmlx.alert('Error trying to delete uploaded document.'); // Jignesh-02-03-2021
                                        }
                                    });
                                wbsTree.setDeleteDocIDs($(this).parents("tr").attr('id'));
                                $(this).parents("tr").remove();
                            }
                            else {
                                //  deleteDocBtn.attr('disabled', false);
                            }
                        });
                    }
                });
            });

            //=========================  Jignesh-ModificationPopUpChanges =====================================================
            $('#DeleteUploadContModification').unbind().on('click', function (event) {
                dhtmlx.confirm("Delete selected document?", function (result) { // Jignesh-24-02-2021 {Remove 's' from document}
                    if (result) {
                        var deleteDocBtn = $('#DeleteUploadContModification');
                        deleteDocBtn.attr('disabled', true);
                        // Disable File Upload Delete and View button
                        $('#DeleteUploadContModification').attr('disabled', 'disabled');
                        $('#ViewUploadFileContModification').attr('disabled', 'disabled');
                        $('#downloadBtnContModification').attr('disabled', 'disabled');

                        $("#gridUploadedDocumentContModification tbody").find('input[name="rbCategoriesMod"]').each(function () {
                            if ($(this).is(":checked")) {
                                //alert($(this).parents("tr").attr('id'));
                                console.log($(this).parents("tr").attr('id'));
                                // alert($(this).parents("tr").attr('id'));

                                _Document.delByDocIDs()
                                    .get({ "docIDs": $(this).parents("tr").attr('id').toString() }, function (response) {
                                        console.log(response);
                                        if (response.result == "Deleted") {
                                            wbsTree.setDeleteDocIDs(null);
                                            _Document.getDocumentByProjID().get({ DocumentSet: 'Program', ProjectID: _selectedProgramID }, function (response) {
                                                //wbsTree.setDocumentList(response.result);
                                                var _documentList = response.result;
                                                _Document.getModificationByProgramId().get({ programId: wbsTree.getSelectedProgramID() }, function (response) {
                                                    var _modificationList = response.data;
                                                    var moda2 = $('#ProgramModal');
                                                    var gridUploadedContDocument = moda2.find("#gridUploadedDocumentProgramNew tbody");
                                                    gridUploadedContDocument.empty();
                                                    for (var x = 0; x < _documentList.length; x++) {
                                                        var modificatioTitle = "";
                                                        for (var i = 0; i < _modificationList.length; i++) {
                                                            if (_documentList[x].ModificationNumber == _modificationList[i].ModificationNo) {
                                                                modificatioTitle = _modificationList[i].ModificationNo + ' - ' + _modificationList[i].Title
                                                            }
                                                        }
                                                        gridUploadedContDocument.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                                            // '<input type="radio" group="prgrb" name="record">' +
                                                            '<input id=rb' + _documentList[x].DocumentID + ' type="radio" name="rbCategories" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                                                            '</td > <td ' +
                                                            'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                                            '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                                            '>' + _documentList[x].DocumentTypeName + '</td>' +
                                                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                                            '>' + modificatioTitle + '</td>' +
                                                            '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                                            '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                                            '<tr > ');   //MM/DD/YYYY h:mm a'

                                                    }
                                                });

                                            });
                                            dhtmlx.alert('File deleted successfully');
                                        } else {
                                            dhtmlx.alert('Error trying to delete uploaded document.'); // Jignesh-02-03-2021
                                        }
                                    });
                                wbsTree.setDeleteDocIDs($(this).parents("tr").attr('id'));
                                $(this).parents("tr").remove();

                            }
                        });

                    }
                });
            });

            //=================  Jignesh-ModificationPopUpChanges Ends here ==================================

            // 2 Pritesh pop up for Project 
            var lobList;
            $('#ProgramElementModal').unbind().on('show.bs.modal', function (event) {
                defaultModalPosition();
                //using on('click','li') will activate on li's click
               
                
                var selectedNode = wbsTree.getSelectedNode();
                debugger
                console.log(selectedNode);
                var s = wbsTree.getOrgProjectName();
                var angularHttp = wbsTree.getAngularHttp();
                //--------------------Swapnil 25-10-2020---------------------------------------------------------------
                var employeeList = wbsTree.getEmployeeList();
                var userList = wbsTree.getUserList();
                var newEmployeeList = [];
                for (var x = 0; x < employeeList.length; x++) {
                    if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                        newEmployeeList.push(employeeList[x]);
                        break;
                    }
                }

                for (var x = 0; x < userList.length; x++) {
                    for (var y = 0; y < employeeList.length; y++) {
                        if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                            newEmployeeList.push(employeeList[y]);
                            break;
                        }
                    }
                }
                employeeList = newEmployeeList;

                angularHttp.get(serviceBasePath + 'request/approvalmatrix').then(function (approversData) {
                    debugger
                    var userList = wbsTree.getUserList();
                    var newEmployeeList = [];
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                            newEmployeeList.push(employeeList[x]);
                            break;
                        }
                    }

                    for (var x = 0; x < userList.length; x++) {
                        for (var y = 0; y < employeeList.length; y++) {
                            if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                                newEmployeeList.push(employeeList[y]);
                                break;
                            }
                        }
                    }
                    employeeList = newEmployeeList;
                    $('#divProjectApprovers').html('');
                    var approvers = approversData.data.result;
                    if (approvers != null && approvers.length > 0) {

                        var totalRows = ~~(approvers.length / 2);
                        var remainderCol = approvers.length % 2;
                        var append = '';

                        if (remainderCol > 0) {
                            totalRows++;
                        }
                        var currentNum = 0;
                        if (totalRows > 0) {
                            //var marginBottom = 150;
                            for (var i = 0; i < totalRows; i++) {
                                //append += "<div class='_form-group' style='margin-bottom: " + marginBottom+"px'>";
                                append += "<div class='_form-group'>";
                                for (var j = 0; j < 2; j++) {
                                    var labelText = approvers[currentNum].Role;
                                    var ddlId = labelText.replace(/ +/g, "_");
                                    var dbid = approvers[currentNum].Id;
                                    if (j == 0) {
                                        append += "<div class='col-xs-6' style='padding-left: 0;'>" +
                                            "<label class='control-label _bold required'>" + labelText + "</label>" +
                                            "<select type='text' class='form-control' id='" + ddlId + "_id' dbid='" + dbid + "'>";
                                        for (var x = 0; x < employeeList.length; x++) {
                                            if (employeeList[x].Name != null) { //universal
                                                append += '<option value="' + employeeList[x].ID + '">' + employeeList[x].Name + '</option>';
                                            }

                                        }
                                    } else {

                                        append += "<div class='col-xs-6' style='padding-left: 0;padding-right: 0;margin-bottom: 15px;'>" +
                                            "<label class='control-label _bold required'>" + labelText + "</label>" +
                                            "<select type='text' class='form-control' id='" + ddlId + "_id' dbid='" + dbid + "'>";
                                        for (var x = 0; x < employeeList.length; x++) {
                                            if (employeeList[x].Name != null) { //universal
                                                append += '<option value="' + employeeList[x].ID + '">' + employeeList[x].Name + '</option>';
                                            }

                                        }

                                    }

                                    append += "</select>";
                                    append += "</div>";
                                    currentNum++;
                                    if (currentNum == approvers.length) {
                                        //append += "<div class='col-xs-6' style='padding-left: 0; display:none;'>" +
                                        //    "<label class='control-label _bold required'></label>" +
                                        //    "<select type='text' class='form-control'>";
                                        //append += "</select>";
                                        //append += "</div>";
                                        break;
                                    }
                                }
                                append += "</div>";
                                //marginBottom = marginBottom + 70;
                            }
                            $('#divProjectApprovers').append(append);
                            //var approversDdl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers select');
                            //for (var i = 0; i < approversDdl.length; i++) {
                            //    $('#'+approversDdl[i].id).val('');
                            //}
                        }

                    }

                });
                //-------------------------------------------------------------------------------------------------
                modal = $(this);

                $('#downloadBtnChangeOrder').attr('disabled', 'disabled');
                $('#ViewUploadFileChangeOrder').attr('disabled', 'disabled');
                $('#edit_program_element_change_order').attr('disabled', 'disabled');
                //console.log(modal);

                ////load docTypeList
                //var docTypeDropDownProgramElement = modal.find('.modal-body #document_type_program_element');
                //var docTypeList = wbsTree.getDocTypeList();
                //docTypeDropDownProgramElement.empty();

                //for (var x = 0; x < docTypeList.length; x++) {
                //    docTypeDropDownProgramElement.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                //}

                //docTypeDropDownProgramElement.val('');

                //Enable upload button for edit Project
                //var uploadBtnProgramElement = modal.find('.modal-body #uploadBtnProgramElement');
                //uploadBtnProgramElement.attr('disabled', false);

                //Load Document Grid
                var gridUploadedDocument = $('#gridUploadedDocumentProgramNewPrg tbody');
                gridUploadedDocument.empty();


                //$("#program_element_contract").change(function () {
                //	//luan here - Find the contract id
                //	var contractList = wbsTree.getContractList();
                //	var selectedContract = modal.find('.modal-body #program_element_contract');
                //	var contract = {};
                //	for (var x = 0; x < contractList.length; x++) {
                //		if (contractList[x].ContractName == selectedContract.val()) {
                //			contract = contractList[x];
                //		}
                //	}
                //	updateProgramElementContractInfo(contract);
                //});
                // Disable File Upload Delete and View button
                $('#DeleteUploadProgramPrg').attr('disabled', 'disabled');
                $('#ViewUploadFileProgramPrg').attr('disabled', 'disabled');
                $('#EditBtnProgramPrg').attr('disabled', 'disabled');
                $('#downloadBtnProgramPrg').attr('disabled', 'disabled');  //Manasi
                $('#updateBtnProgramPrg').removeAttr('disabled');   //Manasi

                $('#program_element_Start_Date').datepicker("destroy"); // Jignesh-05-06-2021
                $("#program_element_Start_Date").datepicker();	//Manasi  21-10-2020

                //----------------------- Add start date end date po date 21-01-2021---------------------------
                $('#program_element_PO_Date').datepicker("destroy"); // Jignesh-05-06-2021
                $("#program_element_PO_Date").datepicker();

                $('#program_element_PStart_Date').datepicker("destroy"); // Jignesh-05-06-2021
                $("#program_element_PStart_Date").datepicker();

                $('#program_element_PEnd_Date').datepicker("destroy"); // Jignesh-05-06-2021
                $("#program_element_PEnd_Date").datepicker();


                //--------------------------------------------------------------------------------------------


                //activateModalDragging();
                if (selectedNode.level == "ProgramElement") {
                    // ProgramElement Update
                    modal_mode = 'Update';
                    $("#new_program_element_change_order").removeAttr('disabled');
                   // $("#edit_program_element_change_order").removeAttr('disabled');
                    $('#divChangeOrder').removeAttr('title');   //Manasi 23-02-2021
                    $("#delete_program_element").removeAttr('disabled');  //Manasi 24-02-2021
                    $('#documentUploadProgramNewPrg').removeAttr('title')  //Manasi 23-02-2021
                    $('#spnBtndelete_program_element').removeAttr('title'); //Manasi 24-02-2021
                    g_newProgramElement = false;
                    wbsTree.setIsProgramElementNew(false);
                    _Is_Program_Element_New = false;
                    populateProgramElementMilestoneTable(wbsTree.getSelectedProgramElementID());
                    populateProgramElementChangeOrderTable(wbsTree.getSelectedProgramElementID()); // pritho
                    //Populate Client PM, Client Phone #
                    var employeeList = wbsTree.getEmployeeList();
                    //------------------ Swapnil commented unused code 26/10/2020 ---------------------------------------------
                    //var ClientPM = {};
                    //for (var x = 0; x < employeeList.length; x++) {
                    //    console.log(selectedNode.parent.ProgramManagerID == employeeList[x].EmployeeID);
                    //    if (selectedNode.parent.ProgramManagerID == employeeList[x].ID) {
                    //        ClientPM = employeeList[x];
                    //        break;
                    //    }
                    //}
                    //---------------------------------------------------------------------------------------------------------
                    //console.log(ClientPM);
                    //modal.find('.modal-body #program_element_client_pm').val(ClientPM.Name);
                    //modal.find('.modal-body #program_element_client_phone').val(selectedNode.parent.ClientPhone);
                    modal.find('.modal-body #program_element_client_pm').val(selectedNode.ClientProjectManager);
                    modal.find('.modal-body #program_element_client_phone').val(selectedNode.ClientPhoneNumber);

                    console.log(selectedNode);
                    modal.find('.modal-body #program_element_contract_number').val(selectedNode.parent.ContractNumber);
                    modal.find('.modal-body #program_element_contract_name').val(selectedNode.parent.name);
                    modal.find('.modal-body #program_element_contract_start_date').val(selectedNode.parent.CurrentStartDate);
                    modal.find('.modal-body #program_element_contract_end_date').val(selectedNode.parent.CurrentEndDate);

                    //_selectedProgramElement = {};

                    ////Get Program Element (Super Project) info here
                    //wbsTree.getProgramElement().lookup().get({ ProgramID: 'null', ProgramElementID: selectedNode.ProgramElementID }, function (response) {
                    //    console.log(response);
                    //    _selectedProgramElement = response.result[0];
                    //});

                    //luan Jquery - luan here
                    //$('#project_class').prop('disabled', true);
                    $("#project_start_date").datepicker();	//datepicker - program element
                    $("#contract_start_date").datepicker();	//datepicker - program element
                    //$('.selectpicker').selectpicker();
                    console.log('applied jquery');
                    console.log(selectedNode);
                    var orgId = $("#selectOrg").val();
                    if (selectedNode.ProjectNumber == null || selectedNode.ProjectNumber == '') {
                        wbsTree.getProjectNumber().get({ OrganizationID: orgId }, function (response) {
                            console.log(response);
                            selectedNode.ProjectNumber = response.result;
                            modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                            dhtmlx.alert('This project previously had no project #. A project # was auto-generated, please remember to save.');
                        });
                    } else {
                        modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                    }
                    console.log(selectedNode);
                    modal.find('.modal-title').text('Project: ' + selectedNode.ProgramElementName);	//luan eats
                    modal.find('.modal-body #project_name').val(selectedNode.ProgramElementName);	//luan eats
                    modal.find('.modal-body #program_element_manager_name').val(selectedNode.ProgramElementManager);
                    modal.find('.modal-body #project_sponsor').val(selectedNode.ProjectSponsor);
                    modal.find('.modal-body #director').val(selectedNode.Director);
                    modal.find('.modal-body #scheduler').val(selectedNode.Scheduler);
                    modal.find('.modal-body #exec_steering_comm').val(selectedNode.ExecSteeringComm);
                    modal.find('.modal-body #vice_president').val(selectedNode.VicePresident);
                    modal.find('.modal-body #financial_analyst').val(selectedNode.FinancialAnalyst);
                    modal.find('.modal-body #capital_project_assistant').val(selectedNode.CapitalProjectAssistant);
                    modal.find('.modal-body #cost_description').val(selectedNode.CostDescription);
                    modal.find('.modal-body #schedule_description').val(selectedNode.ScheduleDescription);
                    modal.find('.modal-body #scope_quality_description').val(selectedNode.ScopeQualityDescription.replace('u000a', '\r\n'));
                    // modal.find('.modal-body #labor_rate').val('');

                    //luan here
                    //modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                    modal.find('.modal-body #contract_number').val(selectedNode.ContractNumber);
                    modal.find('.modal-body #project_start_date').val(selectedNode.ProjectStartDate);   //datepicker - program element
                    modal.find('.modal-body #contract_start_date').val(selectedNode.ContractStartDate); //datepicker - program element

                    modal.find('.modal-body #program_element_contract_value').val(selectedNode.ProjectValueContract);
                    modal.find('.modal-body #program_element_total_value').val(selectedNode.ProjectValueTotal);
                    modal.find('.modal-body #program_element_location_name').val(selectedNode.LocationName);

                    modal.find('.modal-body #program_element_Start_Date').val(selectedNode.ProjectStartDate);   //Manasi 22-10-2020
                    modal.find('.modal-body #program_element_Start_Date').attr('disabled', 'disabled');  //Manasi 22-10-2020

                    // --------------------- Add start date end date po date 21-01-2021 --------------------------------------------------

                    //modal.find('.modal-body #program_element_PO_Date').val(moment(selectedNode.ProjectPODate).format('MM/DD/YYYY')); // Jignesh-26-02-2021
                    modal.find('.modal-body #program_element_PO_Date').val(selectedNode.ProjectPODate ? moment(selectedNode.ProjectPODate).format('MM/DD/YYYY') : ""); // Tanmay 09-11-2021
                    modal.find('.modal-body #program_element_PStart_Date').val(moment(selectedNode.ProjectPStartDate).format('MM/DD/YYYY')); // Jignesh-26-02-2021
                    modal.find('.modal-body #program_element_PEnd_Date').val(moment(selectedNode.ProjectPEndDate).format('MM/DD/YYYY')); // Jignesh-26-02-2021

                    //------------------------------------------------------------------------------------------------------


                    //Load Document Grid
                    var gridUploadedDocumentProgramElement = $('#gridUploadedDocumentProgramNewPrg tbody');// modal.find('.modal-body #gridUploadedDocumentProgramElement tbody');
                    gridUploadedDocumentProgramElement.empty();
                    //------------ Swapnil document management view all project level -----------------------------

                    var gridViewAllUploadedDocumentProgramElement = $('#gridViewAllDocumentInProject');// Jignesh-SearchField-05022021
                    gridViewAllUploadedDocumentProgramElement.empty();
                    $('#ViewUploadFileInViewAllProject').attr('disabled', 'disabled');
                    $('#downloadBtnInViewAllProject').attr('disabled', 'disabled');

                    _Document.getDocumentByProjID().get({ DocumentSet: 'ProjectViewAll', ProjectID: _selectedProgramElementID }, function (response) {
                        wbsTree.setDocumentList(response.result);
                        for (var x = 0; x < _documentList.length; x++) {
                            // Edited by Jignesh (29/10/2020)
                            gridViewAllUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                // '<input type="radio" group="prgrb" name="record">' +
                                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesPrg" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +//jignesh2111
                                '</td > <td ' +
                                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ChangeOrderName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ProjectName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].TrendName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].DocumentTypeName + '</td>' +
                                //'<td>' + moment(_documentList[x].CreatedDate).format('MM/DD/YYYY') + '</td>' +
                                //'<td>' + _documentList[x].CreatedBy + '</td>' +
                                '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                '<tr > ');
                        }

                        $('input[name=rbCategoriesPrg]').on('click', function (event) {
                            // Pritesh for Authorization added on 5th Aug 2020
                            if (wbsTree.getLocalStorage().acl[2] == 1 && wbsTree.getLocalStorage().acl[3] == 0) {
                                $('#ViewUploadFileInViewAllProject').removeAttr('disabled');
                            }
                            else {
                                $('#ViewUploadFileInViewAllProject').removeAttr('disabled');
                                $('#downloadBtnInViewAllProject').removeAttr('disabled');
                            }
                            localStorage.selectedProgramPrgDocument = $(this).closest("tr").find(".docId").text();

                        });
                        //============================ Jignesh-SearchField-05022021 ================================
                        var $rows = $('#gridViewAllDocumentInProject tr');
                        $('#searchProjDoc').keyup(function () { // Jignesh-08-02-2021
                            var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                            $rows.show().filter(function () {
                                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                                return !~text.indexOf(val);
                            }).hide();
                        });
                        //==========================================================================================
                    });

                    //---------------------------------------------------------------------------------------
                    _Document.getDocumentByProjID().get({ DocumentSet: 'ProgramElement', ProjectID: _selectedProgramElementID }, function (response) {
                        wbsTree.setDocumentList(response.result);
                        for (var x = 0; x < _documentList.length; x++) {
                            // Edited by Jignesh (29/10/2020)
                            gridUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                // '<input type="radio" group="prgrb" name="record">' +
                                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesPrg" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +//jignesh2111
                                '</td > <td ' +
                                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                //'<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                //'>' + _documentList[x].ExecutionDate + '</td>' +
                                //'<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"' +
                                //'>' + _documentList[x].DocumentDescription + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].DocumentTypeName + '</td>' +
                                //'<td>' + moment(_documentList[x].CreatedDate).format('MM/DD/YYYY') + '</td>' +
                                //'<td>' + _documentList[x].CreatedBy + '</td>' +
                                '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                '<tr > ');

                            //gridUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                            //    // '<input type="radio" group="prgrb" name="record">' +
                            //    '<input id=rb' + _documentList[x].DocumentID + ' type="radio" name="rbCategoriesPrg" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                            //    '</td > <td ' +
                            //    'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            //    '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                            //    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            //    '>' + _documentList[x].ExecutionDate + '</td>' +
                            //    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"' +
                            //    '>' + _documentList[x].DocumentDescription + '</td>' +

                            //    '<td>' + moment(_documentList[x].CreatedDate).format('MM/DD/YYYY') + '</td>' +
                            //    '<td>' + _documentList[x].CreatedBy + '</td>' +

                            //    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            //    '>' + _documentList[x].DocumentTypeName + '</td>' +
                            //    '<tr > ');   //MM/DD/YYYY h:mm a'





                            //gridUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                            //    // '<input type="radio" group="prgrb" name="record">' +
                            //    '<input id=rb' + _documentList[x].DocumentID + ' type="radio" name="rbCategoriesPrg" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                            //    '</td > <td ' +
                            //    'style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 60%;"' +
                            //    '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                            //    '<td style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 40%;"' +
                            //    '>' + _documentList[x].ExecutionDate + '</td>' +
                            //    '<td style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 40%;"' +
                            //    '>' + _documentList[x].DocumentDescription + '</td>' +
                            //    '<td style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 40%;"' +
                            //    '>' + _documentList[x].DocumentTypeName + '</td>' +
                            //    '<td>' + moment(_documentList[x].CreatedDate).format('MM/DD/YYYY') + '</td>' +
                            //    '<td>' + _documentList[x].CreatedBy + '</td>' +
                            //    '<tr > ');   //MM/DD/YYYY h:mm a'
                            //gridUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px"><input type="checkbox" name="record"></td><td ' +
                            //    'style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 60%;"' +
                            //    '><a href="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '">' + _documentList[x].DocumentName + '</a></td><td ' +
                            //    'style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 40%;"' +
                            //    '>' + _documentList[x].DocumentTypeName + '</td><td>' + moment(_documentList[x].CreatedDate).format('MM/DD/YYYY') + '</td><tr>');   //MM/DD/YYYY h:mm a'
                        }

                        var deleteDocBtn = modal.find('.modal-body #delete-doc');
                        deleteDocBtn.attr('disabled', _documentList.length > 0 ? false : true);

                        $('input[name=rbCategoriesPrg]').on('click', function (event) {
                            // Pritesh for Authorization added on 5th Aug 2020
                            if (wbsTree.getLocalStorage().acl[2] == 1 && wbsTree.getLocalStorage().acl[3] == 0) {
                                $('#ViewUploadFileProgramPrg').removeAttr('disabled');
                                $('#EditBtnProgramPrg').removeAttr('disabled');
                            }
                            else {
                                $('#DeleteUploadProgramPrg').removeAttr('disabled');
                                $('#ViewUploadFileProgramPrg').removeAttr('disabled');
                                $('#EditBtnProgramPrg').removeAttr('disabled');
                                $('#downloadBtnProgramPrg').removeAttr('disabled');
                            }
                            localStorage.selectedProgramPrgDocument = $(this).closest("tr").find(".docId").text();
                        });
                    });


                    //luan here
                    //Popoulate project types for dropdown
                    //Find the project type name given the id
                    var projectTypeDropDown = modal.find('.modal-body #project_type');
                    console.log(projectTypeDropDown);
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var projectTypeName = '';
                    projectTypeDropDown.empty();

                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeID == selectedNode.ProjectTypeID) {
                            projectTypeName = projectTypeList[x].ProjectTypeName
                        }

                        if (projectTypeList[x].ProjectTypeName == null) {
                            continue;
                        }
                        projectTypeDropDown.append('<option selected="false">' + projectTypeList[x].ProjectTypeName + '</option>');
                    }
                    console.log(projectTypeName, selectedNode.ProjectTypeID);
                    projectTypeDropDown.val(projectTypeName);



                    //luan here
                    //Popoulate contract for dropdown
                    //Find the contract name given the id

                    var parent = selectedNode.parent;
                    var programContractList = wbsTree.getProgramContractList();
                    console.log(parent);

                    var contractDropDown = modal.find('.modal-body #program_element_contract');
                    console.log(contractDropDown);
                    var contractList = wbsTree.getContractList();
                    var contractName = '';
                    var contract = {};
                    contractDropDown.empty();

                    for (var x = 0; x < contractList.length; x++) {

                        var existInProgramContractList = false;
                        for (var y = 0; y < programContractList.length; y++) {
                            console.log(programContractList[y].ProgramID == parent.ProgramID, contractList[x].ContractID == programContractList[y].ContractID);
                            if (programContractList[y].ProgramID == parent.ProgramID && contractList[x].ContractID == programContractList[y].ContractID) {
                                existInProgramContractList = true;
                            }
                        }

                        if (existInProgramContractList) {

                            if (contractList[x].ContractID == selectedNode.ContractID) {
                                contractName = contractList[x].ContractName;
                                contract = contractList[x];
                            }

                            if (contractList[x].ContractName == null) {
                                continue;
                            }
                            contractDropDown.append('<option selected="false">' + contractList[x].ContractName + '</option>');
                        }
                    }


                    console.log(contractName, selectedNode.ContractID);
                    contractDropDown.val(contractName);
                    //updateProgramElementContractInfo(contract);



                    //Populate project classes for dropdown
                    //Find the project class name given the id
                    var projectClassDropDown = modal.find('.modal-body #project_class');
                    var projectClassList = wbsTree.getProjectClassList();
                    var projectClassName = '';
                    projectClassDropDown.empty();

                    for (var x = 0; x < projectClassList.length; x++) {
                        if (projectClassList[x].ProjectClassID == selectedNode.ProjectClassID) {
                            projectClassName = projectClassList[x].ProjectClassName
                        }

                        if (projectClassList[x].ProjectClassName == null) {
                            continue;
                        }
                        projectClassDropDown.append('<option selected="false">' + projectClassList[x].ProjectClassName + '</option>');
                    }
                    projectClassDropDown.val(projectClassName);

                    //Populate clients for dropdown
                    //Find the client name given the id
                    var clientDropDown = modal.find('.modal-body #client');
                    var clientList = wbsTree.getClientList();
                    var clientName = '';
                    clientDropDown.empty();

                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientID == selectedNode.ClientID) {
                            clientName = clientList[x].ClientName
                        }

                        if (clientList[x].ClientName == null) {
                            continue;
                        }
                        clientDropDown.append('<option selected="false">' + clientList[x].ClientName + '</option>');
                    }
                    clientDropDown.val(clientName);

                    //Populate project location for dropdown
                    //Find the location name given the id
                    var locationDropDown = modal.find('.modal-body #location');
                    var locationList = wbsTree.getLocationList();
                    var locationName = '';
                    locationDropDown.empty();

                    for (var x = 0; x < locationList.length; x++) {
                        if (locationList[x].LocationID == selectedNode.LocationID) {
                            locationName = locationList[x].LocationName
                        }

                        if (locationList[x].LocationName == null) {
                            continue;
                        }
                        locationDropDown.append('<option selected="false">' + locationList[x].LocationName + '</option>');
                    }
                    locationDropDown.val(locationName);

                    //Populate employees for dropdown
                    //Find the employee name given the id
                    //----------Swapnil 26/10/2020-----------------------------------------------------------
                    //var projectManagerDropDown = modal.find('.modal-body #project_manager_id');
                    //var directorDropDown = modal.find('.modal-body #director_id');
                    //var schedulerDropDown = modal.find('.modal-body #scheduler_id');
                    //var vicePresidentDropDown = modal.find('.modal-body #vice_president_id');
                    //var financialAnalystDropDown = modal.find('.modal-body #financial_analyst_id');
                    //var capitalProjectAssistantDropDown = modal.find('.modal-body #capital_project_assistant_id');

                    //-----------------------------------------------------------------------------------------
                    var laborRateDropdown = modal.find('.modal-body #labor_rate_id');
                    laborRateDropdown.empty();
                    //Append Labor Rate Type
                    laborRateDropdown.append('<option selected="false">' + "Billable Rate" + "</option>");
                    laborRateDropdown.append('<option selected="fasle">' + "Raw Rate with Multiplier" + "</option>");

                    lobList = wbsTree.getLineOfBusinessList();
                    var lobDropdown = modal.find('.moadl-body #project_lob');
                    lobDropdown.empty();
                    for (var x = 0; x < lobDropdown.length; x++) {
                        lobDropdown.append('<option selected="false">' + lobList[x].LOBName + "</option>");
                    }
                    lobDropdown.val("");
                    //----------Swapnil 26/10/2020-----------------------------------------------------------
                    //var employeeList = wbsTree.getEmployeeList();
                    //var userList = wbsTree.getUserList();
                    //var newEmployeeList = [];

                    //for (var x = 0; x < employeeList.length; x++) {
                    //    if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                    //        newEmployeeList.push(employeeList[x]);
                    //        break;
                    //    }
                    //}

                    //for (var x = 0; x < userList.length; x++) {
                    //    for (var y = 0; y < employeeList.length; y++) {
                    //        if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                    //            newEmployeeList.push(employeeList[y]);
                    //            break;
                    //        }
                    //    }
                    //}
                    //employeeList = newEmployeeList;
                    //console.log(employeeList);

                    ////luan quest 2/19
                    //var projectManagerName = 'TBD';
                    //var directorName = 'TBD';
                    //var schedulerName = 'TBD';
                    //var vicePresidentName = 'TBD';
                    //var financialAnalystName = 'TBD';
                    //var capitalProjectAssistantName = 'TBD';

                    //projectManagerDropDown.empty();
                    //directorDropDown.empty();
                    //schedulerDropDown.empty();
                    //vicePresidentDropDown.empty();
                    //financialAnalystDropDown.empty();
                    //capitalProjectAssistantDropDown.empty();

                    //for (var x = 0; x < employeeList.length; x++) {
                    //    if (employeeList[x].ID == selectedNode.ProjectManagerID) {    //Project manager
                    //        projectManagerName = employeeList[x].Name;
                    //    }
                    //    if (employeeList[x].ID == selectedNode.DirectorID) {    //Director
                    //        directorName = employeeList[x].Name;
                    //    }
                    //    if (employeeList[x].ID == selectedNode.SchedulerID) {    //Scheduler
                    //        schedulerName = employeeList[x].Name;
                    //    }
                    //    if (employeeList[x].ID == selectedNode.VicePresidentID) {    //Vice president
                    //        vicePresidentName = employeeList[x].Name;
                    //    }
                    //    if (employeeList[x].ID == selectedNode.FinancialAnalystID) {    //Financial analyst
                    //        financialAnalystName = employeeList[x].Name;
                    //    }
                    //    if (employeeList[x].ID == selectedNode.CapitalProjectAssistantID) {    //Capital project assistant
                    //        capitalProjectAssistantName = employeeList[x].Name;
                    //    }

                    //    if (employeeList[x].Name == null) { //universal
                    //        continue;
                    //    }

                    //    projectManagerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    directorDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    schedulerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    vicePresidentDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    financialAnalystDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    capitalProjectAssistantDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //}
                    //projectManagerDropDown.val(projectManagerName);
                    //directorDropDown.val(directorName);
                    //schedulerDropDown.val(schedulerName);
                    //vicePresidentDropDown.val(vicePresidentName);
                    //financialAnalystDropDown.val(financialAnalystName);
                    //capitalProjectAssistantDropDown.val(capitalProjectAssistantName);
                    //--------------------------------------------------------------------------------------
                    //-------------------------Swapnil 27-10-2020-------------------------------------------------------------
                    var projApproverDetails = null;
                    angularHttp.get(serviceBasePath + 'Request/ProgramElement/null/' + selectedNode.ProgramElementID).then(function (response) {

                        projApproverDetails = response.data.result[0].ApproversDetails;

                        var employeeList = wbsTree.getEmployeeList();
                        var userList = wbsTree.getUserList();
                        var newEmployeeList = [];

                        for (var x = 0; x < employeeList.length; x++) {
                            if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                                newEmployeeList.push(employeeList[x]);
                                break;
                            }
                        }

                        for (var x = 0; x < userList.length; x++) {
                            for (var y = 0; y < employeeList.length; y++) {
                                if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                                    newEmployeeList.push(employeeList[y]);
                                    break;
                                }
                            }
                        }
                        employeeList = newEmployeeList;
                        var approversDdl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers select');

                        for (var i = 0; i < approversDdl.length; i++) {
                            var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                            for (var j = 0; j < projApproverDetails.length; j++) {
                                if (ApproverMatrixId == projApproverDetails[j].ApproverMatrixId) {
                                    //    for (var x = 0; x < employeeList.length; x++) {
                                    //        if (employeeList[x].ID == projApproverDetails[j].EmpId) {  
                                    //            $('#' + approversDdl[i].id).val(employeeList[x].ID);
                                    //            break;
                                    //        }
                                    //    }
                                    $('#' + approversDdl[i].id).val(projApproverDetails[j].EmpId);
                                    break;
                                }
                            }
                        }
                       
                     
                    });
                    //--------------------------------------------------------------------------------------
                }
                else {
                    // ProgramElement create
                    modal_mode = 'Create';
                    selectedNode.ProjectNumber = null;
                    //var orgId = $("#selectOrg").val();
                    //if (selectedNode.ProjectNumber == null || selectedNode.ProjectNumber == '') {
                    //    wbsTree.getProjectNumber().get({ OrganizationID: orgId}, function (response) {
                    //        console.log(response);
                    //        selectedNode.ProjectNumber = response.result;
                    //        modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                    //        dhtmlx.alert('This project previously had no project #. A project # was auto-generated, please remember to save.');
                    //    });
                    //} else {
                    //    modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                    //}
                    $("#new_program_element_change_order").attr('disabled', 'disabled');
                    $("#edit_program_element_change_order").attr('disabled', 'disabled');
                    $("#delete_program_element").attr('disabled', 'disabled');  //Manasi 24-02-2021
                    $('#spnBtndelete_program_element').attr('title', "A project needs to be saved before it can be deleted"); //Manasi 24-02-2021

                    g_newProgramElement = true;
                    wbsTree.setProgramElementFileDraft([]);
                    wbsTree.setIsProgramElementNew(true);
                    _Is_Program_Element_New = true;
                    console.log(selectedNode);

                    $('#program_element_milestone_table_id').empty();
                    $('#program_element_change_order_table_id').empty();
                    g_program_element_milestone_draft_list = [];
                    g_program_element_change_order_draft_list = [];

                    $('#updateBtnProgramPrg').attr('disabled', 'disabled');  //Manasi
                    modal.find('.modal-body #program_element_Start_Date').removeAttr('disabled');  //Manasi 23-10-2020

                    $('#divChangeOrder').attr('title', "A project needs to be saved before the change order can be added");    //Manasi 23-02-2021
                    $('#documentUploadProgramNewPrg').attr('title', "A project needs to be saved before the document can be uploaded");   //Manasi 23-02-2021

                    var gridUploadedDocumentProgramElement = $('#gridUploadedDocumentProgramNewPrg tbody');// modal.find('.modal-body #gridUploadedDocumentProgramElement tbody');
                    gridUploadedDocumentProgramElement.empty();

                    //Populate Client PM, Client Phone #
                    var employeeList = wbsTree.getEmployeeList();
                    //------------------ Swapnil commented unused code 26/10/2020 ---------------------------------------------
                    //var ClientPM = {};
                    //for (var x = 0; x < employeeList.length; x++) {
                    //    console.log(selectedNode.ProgramManagerID == employeeList[x].EmployeeID);
                    //    if (selectedNode.ProgramManagerID == employeeList[x].ID) {
                    //        ClientPM = employeeList[x];
                    //        break;
                    //    }
                    //}
                    //---------------------------------------------------------------------------------------------------------
                    //console.log(ClientPM);
                    //modal.find('.modal-body #program_element_client_pm').val(ClientPM.Name);
                    //modal.find('.modal-body #program_element_client_phone').val(selectedNode.ClientPhone);
                    modal.find('.modal-body #program_element_client_pm').val('');
                    modal.find('.modal-body #program_element_client_phone').val('');

                    modal.find('.modal-body #program_element_contract_number').val(selectedNode.ContractNumber);
                    modal.find('.modal-body #program_element_contract_name').val(selectedNode.name);
                    modal.find('.modal-body #program_element_contract_start_date').val(selectedNode.CurrentStartDate);
                    modal.find('.modal-body #program_element_contract_end_date').val(selectedNode.CurrentEndDate);


                    // //Commented by Manasi to generate Project Number based on year
                    //wbsTree.getProjectNumber().get({}, function (response) {
                    //    console.log(response);
                    //    modal.find('.modal-body #project_number').val(response.result);
                    //});

                    //Populate Client PM, Client Phone #
                    var employeeList = wbsTree.getEmployeeList();
                    //------------------ Swapnil commented unused code 26/10/2020 ---------------------------------------------
                    //var ClientPM = {};
                    //for (var x = 0; x < employeeList.length; x++) {
                    //    console.log(selectedNode.ProgramManagerID == employeeList[x].EmployeeID);
                    //    if (selectedNode.ProgramManagerID == employeeList[x].ID) {
                    //        ClientPM = employeeList[x];
                    //        break;
                    //    }
                    //}
                    //-----------------------------------------------------------------------------------------
                    //luan Jquery - luan here
                    //$('#project_class').prop('disabled', true);
                    $("#project_start_date").datepicker();	//datepicker - program element
                    $("#contract_start_date").datepicker();	//datepicker - program element
                    //$("#datepicker").val('2/2/2012');
                    console.log('applied jquery');

                    modal.find('.modal-title').text('New Project');
                    modal.find('.modal-body #project_name').val('');
                    modal.find('.modal-body #project_manager').val('');
                    modal.find('.modal-body #program_element_manager_name').val('');
                    modal.find('.modal-body #project_sponsor').val('');
                    modal.find('.modal-body #director').val('');
                    modal.find('.modal-body #scheduler').val('');
                    modal.find('.modal-body #exec_steering_comm').val('');
                    modal.find('.modal-body #vice_president').val('');
                    modal.find('.modal-body #financial_analyst').val('');
                    modal.find('.modal-body #capital_project_assistant').val('');
                    modal.find('.modal-body #cost_description').val('');
                    modal.find('.modal-body #schedule_description').val('');
                    modal.find('.modal-body #scope_quality_description').val('');
                    modal.find('.modal-body #labor_rate_id').val('');
                    modal.find('.modal-body #labor_rate').val('');
                    //luan here

                    modal.find('.modal-body #contract_number').val('');
                    modal.find('.modal-body #client').val('');
                    modal.find('.modal-body #project_class').val('');
                    modal.find('.modal-body #project_start_date').val('');  //datepicker - program element
                    modal.find('.modal-body #contract_start_date').val(''); //datepicker - program element

                    //modal.find('.modal-body #program_element_contract_start_date').val('');
                    //modal.find('.modal-body #program_element_contract_end_date').val('');
                    //modal.find('.modal-body #program_element_contract_number').val('');

                    modal.find('.modal-body #program_element_contract_value').val('');
                    modal.find('.modal-body #program_element_total_value').val('');
                    modal.find('.modal-body #program_element_location_name').val('');

                    modal.find('.modal-body #project_class').val('');

                    modal.find('.modal-body #program_element_Start_Date').val('');   //Manasi 23-10-2020
                      
                    //----------------------------- Add start date end date po date 21-01-2021--------------------

                    modal.find('.modal-body #program_element_PO_Date').val('');
                    modal.find('.modal-body #program_element_PStart_Date').val('');
                    modal.find('.modal-body #program_element_PEnd_Date').val('');

                    //------------------------------------------------------------------------------------------


                    //luan here
                    //Populate project types for dropdown
                    var projectTypeDropDown = modal.find('.modal-body #project_type');
                    var projectTypeList = wbsTree.getProjectTypeList();
                    projectTypeDropDown.empty();

                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == null) {
                            continue;
                        }
                        projectTypeDropDown.append('<option selected="false">' + projectTypeList[x].ProjectTypeName + '</option>');
                        projectTypeDropDown.val('');
                    }

                    var programContractList = wbsTree.getProgramContractList();

                    //luan here
                    //Popoulate contract for dropdown
                    var contractDropDown = modal.find('.modal-body #program_element_contract');
                    var contractList = wbsTree.getContractList();
                    contractDropDown.empty();

                    for (var x = 0; x < contractList.length; x++) {
                        var existInProgramContractList = false;
                        for (var y = 0; y < programContractList.length; y++) {
                            console.log(programContractList[y].ProgramID, selectedNode.ProgramID, contractList[x].ContractID == programContractList[y].ContractID);
                            if (programContractList[y].ProgramID == selectedNode.ProgramID && contractList[x].ContractID == programContractList[y].ContractID) {
                                existInProgramContractList = true;
                            }
                        }

                        if (existInProgramContractList) {
                            if (contractList[x].ContractName == null) {
                                continue;
                            }
                            contractDropDown.append('<option selected="false">' + contractList[x].ContractName + '</option>');
                        }
                        contractDropDown.val('');
                    }

                    //Populate project classes for dropdown
                    //Find the project class name given the id
                    if (wbsTree.getSelectedOrganizationID() == null) {
                        wbsTree.setSelectedOrganizationID($("#selectOrg").val());
                    }
                    console.log(wbsTree.getSelectedOrganizationID(), wbsTree.getSelectedProgramID());
                    var projectClassIDFromProgram = null;
                    wbsTree.getProgram().lookup().get({ OrganizationID: wbsTree.getSelectedOrganizationID(), ProgramID: wbsTree.getSelectedProgramID(), ProgramID: wbsTree.getSelectedProgramID() }, function (response) {
                        console.log(response);
                        projectClassIDFromProgram = response.result[0].ProjectClassID;

                        selectedNode.ProjectClassID = projectClassIDFromProgram;
                        var projectClassDropDown = modal.find('.modal-body #project_class');
                        var projectClassList = wbsTree.getProjectClassList();
                        var projectClassName = '';
                        projectClassDropDown.empty();

                        for (var x = 0; x < projectClassList.length; x++) {
                            if (projectClassList[x].ProjectClassID == selectedNode.ProjectClassID) {
                                projectClassName = projectClassList[x].ProjectClassName
                            }

                            if (projectClassList[x].ProjectClassName == null) {
                                continue;
                            }
                            projectClassDropDown.append('<option selected="false">' + projectClassList[x].ProjectClassName + '</option>');
                        }
                        projectClassDropDown.val(projectClassName);
                        projectClassDropDown.attr('disabled', false);
                    });

                    //Populate project client for dropdown
                    var clientDropDown = modal.find('.modal-body #client');
                    var clientList = wbsTree.getClientList();
                    clientDropDown.empty();

                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientName == null) {
                            continue;
                        }
                        clientDropDown.append('<option selected="false">' + clientList[x].ClientName + '</option>');
                        clientDropDown.val('');
                    }

                    //Populate project location for dropdown
                    var locationDropDown = modal.find('.modal-body #location');
                    var locationList = wbsTree.getLocationList();
                    locationDropDown.empty();

                    for (var x = 0; x < locationList.length; x++) {
                        if (locationList[x].LocationName == null) {
                            continue;
                        }
                        locationDropDown.append('<option selected="false">' + locationList[x].LocationName + '</option>');
                        locationDropDown.val('');
                    }

                    //Populate employees for dropdown
                    //-------------------------Swapnil 25-10-2020----------------------------------------------
                    //var projectManagerDropDown = modal.find('.modal-body #project_manager_id');
                    //var directorDropDown = modal.find('.modal-body #director_id');
                    //var schedulerDropDown = modal.find('.modal-body #scheduler_id');
                    //var vicePresidentDropDown = modal.find('.modal-body #vice_president_id');
                    //var financialAnalystDropDown = modal.find('.modal-body #financial_analyst_id');
                    //var capitalProjectAssistantDropDown = modal.find('.modal-body #capital_project_assistant_id');
                    //-------------------------------------------------------------------------------------------------
                    var laborRateDropdown = modal.find('.modal-body #labor_rate_id');

                    //-------------------------Swapnil 25-10-2020----------------------------------------------
                    //var employeeList = wbsTree.getEmployeeList();
                    //var userList = wbsTree.getUserList();
                    //var newEmployeeList = [];
                    //console.log(userList);
                    //for (var x = 0; x < employeeList.length; x++) {
                    //    if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                    //        newEmployeeList.push(employeeList[x]);
                    //        break;
                    //    }
                    //}

                    //for (var x = 0; x < userList.length; x++) {
                    //    for (var y = 0; y < employeeList.length; y++) {
                    //        if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                    //            newEmployeeList.push(employeeList[y]);
                    //            break;
                    //        }
                    //    }
                    //}
                    //employeeList = newEmployeeList;
                    //console.log(employeeList);

                    //projectManagerDropDown.empty();
                    //directorDropDown.empty();
                    //schedulerDropDown.empty();
                    //vicePresidentDropDown.empty();
                    //financialAnalystDropDown.empty();
                    //capitalProjectAssistantDropDown.empty();
                    //-------------------------------------------------------------------------------------------------
                    laborRateDropdown.empty();
                    //Append Labor Rate Type
                    laborRateDropdown.append('<option selected="false">' + "Billable Rate" + "</option>");
                    laborRateDropdown.append('<option selected="fasle">' + "Raw Rate with Multiplier" + "</option>");
                    laborRateDropdown.val('Billable Rate');
                    laborRateDropdown.attr('disabled', false);
                    //-------------------------------------Swapnil 25-10-2020------------------------------------------------------------
                    //for (var x = 0; x < employeeList.length; x++) {
                    //    if (employeeList[x].Name == null) { //universal
                    //        continue;
                    //    }

                    //    projectManagerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    directorDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    schedulerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    vicePresidentDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    financialAnalystDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                    //    capitalProjectAssistantDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');

                    //    projectManagerDropDown.val('');
                    //    directorDropDown.val('');
                    //    schedulerDropDown.val('');
                    //    vicePresidentDropDown.val('');
                    //    financialAnalystDropDown.val('');
                    //    capitalProjectAssistantDropDown.val('');
                    //}
                    //-------------------------------------------------------------------------------------------------

                    //-----------------------Luan 08202020 Default TBD for roles(comment swapnil 25-10-2020)----------------------------------------------------
                    //var tbdEmployee = {};
                    //for (var x = 0; x < employeeList.length; x++) {
                    //    if (employeeList[x].ID == 10000 || (employeeList[x].FirstName == 'TBD' && employeeList[x].LastName == 'TBD')) {
                    //        tbdEmployee = employeeList[x];
                    //        break;
                    //    }
                    //}
                    //console.log(tbdEmployee);
                    //modal.find('.modal-body #director_id').val(tbdEmployee.Name);
                    //modal.find('.modal-body #scheduler_id').val(tbdEmployee.Name);
                    //modal.find('.modal-body #vice_president_id').val(tbdEmployee.Name);
                    //modal.find('.modal-body #financial_analyst_id').val(tbdEmployee.Name);
                    //modal.find('.modal-body #capital_project_assistant_id').val(tbdEmployee.Name);
                    //modal.find('.modal-body #project_manager_id').val(tbdEmployee.Name);
                    //--------------------------------------------------------------------------------------------------------------
                    //---------------------- Swapnil 27-10-2020 set default role TBD--------------------------------------------

                    var approversDdl = $('#ProgramElementModal').find('.modal-body #divProjectApprovers select');
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].ID == 10000 || (employeeList[x].FirstName == 'TBD' && employeeList[x].LastName == 'TBD')) {
                            for (var i = 0; i < approversDdl.length; i++) {
                                $('#' + approversDdl[i].id).val(employeeList[x].Name);
                            }
                            break;
                        }
                    }

                    //--------------------------------------------------------------------------------------------
                    //No upload before project is saved.
                    var uploadBtnProject = modal.find('.modal-body #uploadBtnProject');
                    //uploadBtnProject.attr('disabled', true);

                    var gridUploadedDocumentProgramElement = modal.find('.modal-body #gridUploadedDocumentProgramElement tbody');
                    gridUploadedDocumentProgramElement.empty();
                }

                var locationLatLong = null;
                if (selectedNode.level == "Project") {
                    if (selectedNode != null && selectedNode.LatLong != null && selectedNode.LatLong != "") {
                        locationLatLong = selectedNode.LatLong;
                    }
                }

                // Pritesh for Authorization added on 5th Aug 2020
                if (wbsTree.getLocalStorage().acl[2] == 1 && wbsTree.getLocalStorage().acl[3] == 0) {
                    $("#delete_program_element").attr('disabled', 'disabled');
                    $("#update_program_element").attr('disabled', 'disabled');
                    // $('#ProgramElementModal :input').attr('disabled', 'disabled');
                    $('#updateBtnProgramPrg').attr('disabled', 'disabled');
                    $('#new_program_element_change_order').attr('disabled', 'disabled');
                    $('#edit_program_element_change_order').attr('disabled', 'disabled');
                    $('#new_program_element_milestone').attr('disabled', 'disabled');
                    $('#edit_program_element_milestone').attr('disabled', 'disabled');
                    $('#cancel_program_element').removeAttr('disabled');
                    $('#cancel_program_element_x').removeAttr('disabled');
                }
                else {
                    //$("#delete_program_element").removeAttr('disabled'); //Manasi 24-02-2021
                    $("#update_program_element").removeAttr('disabled');
                    $('#new_program_element_milestone').removeAttr('disabled');
                    $('#edit_program_element_milestone').removeAttr('disabled');
                    //  $('#ProgramElementModal :input').removeAttr('disabled');
                    if (selectedNode.level == "ProgramElement") {
                        // Edit
                        $("#new_program_element_change_order").removeAttr('disabled');
                      //  $("#edit_program_element_change_order").removeAttr('disabled');
                        $('#updateBtnProgramPrg').removeAttr('disabled');
                    } else {
                        // Add
                        $("#new_program_element_change_order").attr('disabled', 'disabled');
                        $("#edit_program_element_change_order").attr('disabled', 'disabled');
                        $('#updateBtnProgramPrg').attr('disabled', 'disabled');
                    }



                    $('#new_program_element_milestone').removeAttr('disabled');
                    $('#edit_program_element_milestone').removeAttr('disabled');
                }

                var projectEditMap = new ProjectMap();

                window.setTimeout(function () { projectEditMap.initProjectEditMap(locationLatLong, wbsTree.getOrganizationList()); }, 250);
            });


            $('#ProgramElementModal').on('shown.bs.modal', function () {
                $('[id$=program_element_name]').focus();
                originalInfo = wbsTree.getSelectedNode();
            });





            /// 3 Modal Project Element Priteshf



            // Click for Pop up 2 pritesh Upload Pop up
            $('#DocUpdateModalPrgElm').unbind().on('show.bs.modal', function (event) {
                $("#ProjectModal").css({ "opacity": "0.4" });
                $("#PrgExecutionDatePrgElm").datepicker();
                modal = $(this);
                //load docTypeList
                var docTypeDropDownProgram = modal.find('.modal-body #document_type_programPrgElm');
                var docTypeList = wbsTree.getDocTypeList();
                docTypeDropDownProgram.empty();
                if (wbsTree.getLocalStorage().role === "Admin") {
                    docTypeDropDownProgram.append('<option value="Add New"> ----------Add New---------- </option>');
                }
                if (g_editelementdocument == false) {
                    // Jignesh-25-03-2021

                    for (var x = 0; x < docTypeList.length; x++) {
                        docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                    }
                    docTypeDropDownProgram.val('');
                }
                else {
                    for (var x = 0; x < docTypeList.length; x++) {
                        if (docTypeList[x].DocumentTypeID == g_document_type_element) {
                            docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '" selected> ' + docTypeList[x].DocumentTypeName + '</option>');
                            docTypeDropDownProgram.val(docTypeList[x].DocumentTypeID);
                        } else {
                            docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                        }
                    }
                }

                //docTypeDropDownProgram.val('');
                //$('#PrgSpecialNotePrgElm').val('');  //Manasi
                //$('#PrgExecutionDatePrgElm').val('');  //Manasi
                //$('#fileUploadProject').val('');  //Manasi
                //$('#document_name_project').val('');
            });

            // Upload Pop up Click of Contract
            $('#updateBtnProgramPrgElm').unbind().on('click', function (event) {  //Manasi
                g_editelementdocument = false;
                //$('#DocUpdateModalPrgElm').modal({ show: true, backdrop: 'static' });
                //---------------Manasi------------------------------------
                if (wbsTree.getIsProjectNew()) {
                    dhtmlx.alert('Uploading files only work in edit mode.');
                    return;
                }
                else {
                    $('#PrgSpecialNotePrgElm').val('');  //Manasi
                    $('#document_type_programPrgElm').val('');  //Manasi
                    $('#fileUploadProject').val('');  //Manasi
                    $('#document_name_project').val('');
                    $('#DocUpdateModalPrgElm').modal({ show: true, backdrop: 'static' });
                }
                //-----------------------------------------------------------
            });

            //--------------------- Swapnil Display all documents in program element 22-01-2021 ------------------

            $('#ViewAllUploadFileProgramPrgElm').unbind().on('click', function (event) {
                $('#searchElem').val(''); // Jignesh-24-02-2021
                //========================== Jignesh-23-02-2021 ======================

                var gridViewAllUploadedDocumentProgramElement = $('#gridViewAllDocumentInProgramElement');
                gridViewAllUploadedDocumentProgramElement.empty();

                $('#downloadBtnInViewAllProgramElement').attr('disabled', 'disabled');
                $('#ViewUploadFileInViewAllProgramElement').attr('disabled', 'disabled');

                _Document.getDocumentByProjID().get({ DocumentSet: 'ProjectElementViewAll', ProjectID: _selectedProjectID }, function (response) {
                    wbsTree.setDocumentList(response.result);
                    for (var x = 0; x < _documentList.length; x++) {

                        gridViewAllUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                            // '<input type="radio" group="prgrb" name="record">' +
                            '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesPrgElm" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' + //jignesh2111
                            '</td > <td ' +
                            'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '>' + _documentList[x].TrendName + '</td>' +
                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '>' + _documentList[x].DocumentTypeName + '</td>' +
                            '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                            '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                            '<tr > ');


                    }

                    $('input[name=rbCategoriesPrgElm]').on('click', function (event) {

                        if (wbsTree.getLocalStorage().acl[4] == 1 && wbsTree.getLocalStorage().acl[5] == 0) {

                            $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled');
                        }
                        else {

                            $('#downloadBtnInViewAllProgramElement').removeAttr('disabled');
                            $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled');
                        }
                        g_selectedElementDocument = $(this).closest("tr").find(".docId").text();

                    });

                    var $rows = $('#gridViewAllDocumentInProgramElement tr');
                    $('#searchElem').keyup(function () {
                        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                        $rows.show().filter(function () {
                            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                            return !~text.indexOf(val);
                        }).hide();
                    });

                });

                //====================================================================
                $('#DisplayAllDocumentsInProgramElement').modal({ show: true, backdrop: 'static' });

            });


            $('#ViewAllUploadFileProjects').unbind().on('click', function (event) {
                //============================  Jignesh-03-03-2021 ==============================
                $('#downloadBtnInViewAllProject').attr('disabled', 'disabled');
                $('#ViewUploadFileInViewAllProject').attr('disabled', 'disabled');
                //===============================================================================
                $('#searchProjDoc').val(''); // Jignesh-24-02-2021
                //============================  Jignesh-23-02-2021 ==============================

                var gridViewAllUploadedDocumentProgramElement = $('#gridViewAllDocumentInProject');
                gridViewAllUploadedDocumentProgramElement.empty();

                _Document.getDocumentByProjID().get({ DocumentSet: 'ProjectViewAll', ProjectID: _selectedProgramElementID }, function (response) {
                    wbsTree.setDocumentList(response.result);
                    for (var x = 0; x < _documentList.length; x++) {
                        var viewBtnId = _documentList[x].ChangeOrderName ? "viewAllOrderDetail" : "viewDocumentDetail"; // Jignesh-01-03-2021
                        gridViewAllUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                            // '<input type="radio" group="prgrb" name="record">' +
                            '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesPrg" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +//jignesh2111
                            '</td > <td ' +
                            'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '>' + _documentList[x].ChangeOrderName + '</td>' +
                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '>' + _documentList[x].ProjectName + '</td>' +
                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '>' + _documentList[x].TrendName + '</td>' +
                            '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                            '>' + _documentList[x].DocumentTypeName + '</td>' +
                            //'<td>' + moment(_documentList[x].CreatedDate).format('MM/DD/YYYY') + '</td>' +
                            //'<td>' + _documentList[x].CreatedBy + '</td>' +
                            '<td><input type="button" name="btnViewDetail"  id="' + viewBtnId + '" style="color:white;background-color: #0c50e8;" value="View"/></td>' + // Jignesh-01-03-2021
                            '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                            '<tr > ');
                    }

                    $('input[name=rbCategoriesPrg]').on('click', function (event) {

                        if (wbsTree.getLocalStorage().acl[2] == 1 && wbsTree.getLocalStorage().acl[3] == 0) {
                            $('#ViewUploadFileInViewAllProject').removeAttr('disabled');
                        }
                        else {
                            $('#ViewUploadFileInViewAllProject').removeAttr('disabled');
                            $('#downloadBtnInViewAllProject').removeAttr('disabled');
                        }

                    });

                    var $rows = $('#gridViewAllDocumentInProject tr');
                    $('#searchProjDoc').keyup(function () { // Jignesh-08-02-2021
                        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                        $rows.show().filter(function () {
                            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                            return !~text.indexOf(val);
                        }).hide();
                    });

                });

                //===============================================================================

                $('#DisplayAllDocumentsInProject').modal({ show: true, backdrop: 'static' });

            });

            $('#ViewAllUploadFileContracts').unbind().on('click', function (event) {
                //============================  Jignesh-04-03-2021 ==============================
                $('#ViewUploadFileInViewAllContracts').attr('disabled', 'disabled');
                $('#downloadBtnInViewAllContracts').attr('disabled', 'disabled');
                //===============================================================================
                $('#searchCont').val(''); // Jignesh-24-02-2021

                //======================= Jignesh-25-02-2021 Replace the entire block of code ===================================
                _Document.getDocumentByProjID().get({ DocumentSet: 'ContractViewAll', ProjectID: _selectedProgramID }, function (response) {
                    //wbsTree.setDocumentList(response.result);
                    var _documentList = response.result;
                    _Document.getModificationByProgramId().get({ programId: wbsTree.getSelectedProgramID() }, function (response) {
                        var _modificationList = response.data;
                        //var moda2 = $('#ProgramModal');
                        var gridViewAllUploadedDocumentProgram = $("#gridViewAllDocumentInContract");
                        gridViewAllUploadedDocumentProgram.empty();
                        for (var x = 0; x < _documentList.length; x++) {
                            var modificatioTitle = "";
                            for (var i = 0; i < _modificationList.length; i++) {
                                if (_documentList[x].ModificationNumber == _modificationList[i].ModificationNo) {
                                    modificatioTitle = _modificationList[i].ModificationNo + ' - ' + _modificationList[i].Title
                                }
                            }
                            var viewBtnId = _documentList[x].ChangeOrderName ? "viewAllOrderDetail" : "viewDocumentDetail"; // Jignesh-01-03-2021
                            gridViewAllUploadedDocumentProgram.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                // '<input type="radio" group="prgrb" name="record">' +
                                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategories" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                                '</td > <td ' +
                                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + modificatioTitle + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ProjectElementName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ChangeOrderName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].ProjectName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].TrendName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].DocumentTypeName + '</td>' +
                                '<td><input type="button" name="btnViewDetail"  id="' + viewBtnId + '" style="color:white;background-color: #0c50e8;" value="View"/></td>' + // Jignesh-01-03-2021
                                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                '<tr > ');   //MM/DD/YYYY h:mm a'

                        }
                        $('input[name=rbCategories]').on('click', function (event) {
                            if (wbsTree.getLocalStorage().acl[0] == 1 && wbsTree.getLocalStorage().acl[1] == 0) {
                                $('#ViewUploadFileInViewAllContracts').removeAttr('disabled');
                            }
                            else {
                                $('#ViewUploadFileInViewAllContracts').removeAttr('disabled');
                                $('#downloadBtnInViewAllContracts').removeAttr('disabled');
                            }

                        });

                        var $rows = $('#gridViewAllDocumentInContract tr');
                        $('#searchCont').keyup(function () {
                            var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                            $rows.show().filter(function () {
                                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                                return !~text.indexOf(val);
                            }).hide();
                        });
                    });

                });
                //===================================================================================================================
                $('#DisplayAllDocumentsInContract').modal({ show: true, backdrop: 'static' });

            });

            //----------------------------------------------------------------------------------------------------


            //========================= Added by Jignesh 27-10-2020 =====================================================
            //$('input[name = "btnViewDetail"]').unbind().on('click', function () {
            //Jignesh-ModificationPopUpChanges {Just include gridUploadedDocumentContModification in below line }
            //Jignesh-08-02-2021
            $('#gridUploadedDocumentProgramNew,#gridUploadedDocumentProgramNewPrg,#gridUploadedDocumentProgramNewPrgElm,#gridViewAllDocumentInProgramElement,#gridViewAllDocumentInProject,#gridViewAllDocumentInContract,#gridUploadedDocumentTrend').on('click', '#viewDocumentDetail', function (event) {
                var docId = $(this).closest("tr").find(".docId").text();
                var docData = {};
                console.log(docId);
                $.each(_documentList,
                    function (i, el) {
                        if (this.DocumentID == docId) {
                            docData = _documentList[i];
                            console.log(_documentList[i]);
                        }
                    });
                $('#txtDocNameViewModel').val(docData.DocumentName);
                $('#txtDocTypeViewModel').val(docData.DocumentTypeName);
                $('#txtUploadDateViewModel').val(moment(docData.CreatedDate).format('MM/DD/YYYY'));
                $('#txtUploadByViewModel').val(docData.CreatedBy);
                $('#txtDocNoteViewModel').val(docData.DocumentDescription);
                $('#DocViewModalPrg').modal({ show: true, backdrop: 'static' });
            });

            $('#EditBtnProgram').on('click', function (event) {
                g_editdocument = true;


                var docId = localStorage.selectedProjectDocument;

                var docData = {};
                console.log(docId);
                $.each(_documentList,
                    function (i, el) {
                        if (this.DocumentID == docId) {
                            docData = _documentList[i];
                            console.log(_documentList[i]);
                        }
                    });

                g_document_type_program = docData.DocumentTypeID;

                $('#DocID').val(docData.DocumentID);
                $('#PrgSpecialNote').val(docData.DocumentDescription);
                $("#document_type_program  option").filter(":selected").text(docData.DocumentTypeName);
                $('#document_type_program').val(docData.DocumentTypeName);
                $('#document_name_program').val(docData.DocumentName);
                $('#DocUpdateModal').modal({ show: true, backdrop: 'static' });


            });
            $('#EditBtnProgramPrg').on('click', function (event) {
                g_editprojectdocument = true;

                var docId = localStorage.selectedProgramPrgDocument;
                var docData = {};
                console.log(docId);
                $.each(_documentList,
                    function (i, el) {
                        if (this.DocumentID == docId) {
                            docData = _documentList[i];
                            console.log(_documentList[i]);
                        }
                    });

                g_document_type_project = docData.DocumentTypeID;
                $('#DocprojectID').val(docData.DocumentID);
                $('#PrgSpecialNotePrg').val(docData.DocumentDescription);
                $('#document_type_programPrg').val(docData.DocumentTypeName);
                $('#document_name_program_element').val(docData.DocumentName);
                $('#DocUpdateModalPrg').modal({ show: true, backdrop: 'static' });


            });
            $('#EditBtnProgramPrgElm').on('click', function (event) {
                g_editelementdocument = true;

                var docId = localStorage.selectedElementDocument;
                var docData = {};
                console.log(docId);
                $.each(_documentList,
                    function (i, el) {
                        if (this.DocumentID == docId) {
                            docData = _documentList[i];
                            console.log(_documentList[i]);
                        }
                    });

                g_document_type_element = docData.DocumentTypeID;

                $('#DocElementID').val(docData.DocumentID);
                $('#PrgSpecialNotePrgElm').val(docData.DocumentDescription);
                $('#document_type_programPrgElm').val(docData.DocumentTypeName);
                $('#document_name_project').val(docData.DocumentName);
                $('#DocUpdateModalPrgElm').modal({ show: true, backdrop: 'static' });


            });
            $('#EditBtnTrend').on('click', function (event) {
                g_edittrenddocument = true;

                var docId = localStorage.selectedTrendDocument;
                var docData = {};
                console.log(docId);
                $.each(_documentList,
                    function (i, el) {
                        if (this.DocumentID == docId) {
                            docData = _documentList[i];
                            console.log(_documentList[i]);
                        }
                    });

                g_document_type_trend = docData.DocumentTypeID;

                $('#DocTrendID').val(docData.DocumentID);
                $('#DocSpecialNoteTrend').val(docData.DocumentDescription);
                $('#document_type_trend').val(docData.DocumentTypeName);
                $('#document_name_trend').val(docData.DocumentName);
                $('#DocUpdateModalTrend').modal({ show: true, backdrop: 'static' });


            });

            //=============================================================================================================

            //========================= Updated by Jignesh-01-03-2021 =====================================================
            $('#program_element_change_order_table_id,#gridViewAllDocumentInContract,#gridViewAllDocumentInProject').on('click', '#viewOrderDetail,#viewAllOrderDetail', function () {
                event.preventDefault();
                var _ChangeOrderTrendList = [];
                var self = wbsTree.getSelectedNode();
                var organizationId = $("#selectOrg").val();
                var thisData = $(this);
                var docId = $(this).closest("tr").find(".docId").text();
                var docData = {};
                console.log(docId);
                if (thisData[0].id == "viewOrderDetail") {
                    $.each(_changeOrderList,
                        function (i, el) {
                            if (this.ChangeOrderID == docId) {
                                docData = _changeOrderList[i];
                            }
                        });
                }
                else {
                    $.each(_changeOrderList,
                        function (i, el) {
                            if (this.DocumentID == docId) {
                                docData = _changeOrderList[i];
                                docId = _changeOrderList[i].ChangeOrderID;
                            }
                        });
                }

                //==================== Jignesh-ChangeOrderPopUpChanges ==================
                var changeOrderType = docData.ModificationTypeId == 1 ? 'Value' :
                    docData.ModificationTypeId == 2 ? 'Schedule Impact' : 'Value & Schedule Impact';

                $('#change_order_view_doc_name_modal').val(docData.DocumentName);
                $('#change_order_view_title_modal').val(docData.ChangeOrderName);
                //$('#change_order_view_order_type_modal').val(moment(docData.CreatedDate).format('MM/DD/YYYY'));
                $('#change_order_view_order_type_modal').val(changeOrderType);
                $('#change_order_view_clientorder_num_modal').val(docData.ChangeOrderNumber);
                $('#change_order_view_date_modal').val(moment(docData.OrderDate).format('MM/DD/YYYY'));

                $('#change_order_view_note_modal').val(docData.ChangeOrderScheduleChange);
                $('#program_element_change_order_Reason_modal_E').val(docData.Reason);
                $('#change_order_view_Amount_modal').val('$' + docData.ChangeOrderAmount.replace('$', ''));
                $('#program_element_change_order_schedule_impact_E').val(docData.ScheduleImpact); // Jignesh-24-03-2021
                //$('#program_element_change_order_duration_date_E').val(moment(docData.DurationDate).format('MM/DD/YYYY')); // Jignesh-24-03-2021

                if (docData.ModificationTypeId == 1) {
                    $('#divValueE').show();
                    $('#divDurationDateE').hide();
                }
                else if (docData.ModificationTypeId == 2) {
                    $('#divValueE').hide();
                    $('#divDurationDateE').show();
                }
                else if (docData.ModificationTypeId == 3) {
                    $('#divValueE').show();
                    $('#divDurationDateE').show();
                }

                //==========================================================================================================
                var gridChangeOrderTrendList = $("#gridChangeOrderList tbody")// modal.find('#gridUploadedDocumentProgram tbody');
                gridChangeOrderTrendList.empty();
                if (self.children) {
                    _Trend.getAllTrendsForChangeOrderList().get({
                        ProjectID: self.children[0].ProjectID
                    }, function (response) {
                        gridChangeOrderTrendList.empty();
                        // Jignesh-TDM-06-01-2020
                        _ChangeOrderTrendList = response.result;
                        if (_ChangeOrderTrendList.length > 0) {
                            for (var x = 0; x < _ChangeOrderTrendList.length; x++) {
                                if (_ChangeOrderTrendList[x].ChangeOrderID == docId) {
                                    gridChangeOrderTrendList.append('<tr>' +
                                        '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                        '><a>' + _ChangeOrderTrendList[x].TrendDescription + '</a></td> ' +
                                        '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                        '><a href="' + window.location.href.replace("wbs", "") + 'cost-gantt/' + _ChangeOrderTrendList[x].ProjectID + '/' + _ChangeOrderTrendList[x].TrendNumber + '/' + organizationId + '" target="_blank">Open Trend</a></td>' +  // Jignesh-10-06-2021
                                        '<tr > ');
                                }
                            }
                        }
                        _ChangeOrderTrendList = [];
                    });
                }
                $('#ProgramElementChangeOrderViewModal').modal({ show: true, backdrop: 'static' });
            });



            //=============================================================================================================

            //===================== Jignesh-31-03-2021 Setup Page Exit Pop Message ==============================================

            var contPageFieldIDs = '#program_name,#program_contract_number,#program_current_start_date,#program_current_end_date,' +
                '#program_client_poc,#program_billing_poc,#program_billing_poc_phone_1,#program_billing_poc_phone_2,' +
                '#program_billing_poc_email,#program_billing_poc_address_line1,#program_billing_poc_address_line2,#program_client_phone,' +
                '#program_client_email,#program_client_address_line1,#program_client_address_line2,#program_client_city,#program_client_state,' +
                '#program_client_po_num,#program_project_manager,#program_billing_poc_city,#program_billing_poc_state,#program_billing_poc_po_num,' +
                '#program_billing_poc_po_num,#program_project_manager,#program_project_manager_phone,#program_project_manager_email,' +
                '#program_tm_billing,#program_sov_billing,#program_monthly_billing,#program_Lumpsum,#program_billing_poc_special_instruction';

            $(contPageFieldIDs).unbind().on('input change paste', function (e) {
                isFieldValueChanged = true;
            });
            $('#cancel_program,#cancel_program_x').unbind('click').on('click', function () {
                if (isFieldValueChanged) {
                    dhtmlx.confirm("Unsaved data will be lost. Want to Continue?", function (result) {
                        if (result) {
                            if (wbsTree.unsavedChanges("Program")) {
                                $("#ProgramModal").css({ "opacity": "0.4" });
                                $("#ExitConfirmModal").appendTo('body');
                                $("#ExitConfirmModal").modal('toggle');
                            } else {
                                $("#ProgramModal").modal('toggle');
                            }
                            isFieldValueChanged = false;
                        }
                    });
                }
                else {
                    if (wbsTree.unsavedChanges("Program")) {
                        $("#ProgramModal").css({ "opacity": "0.4" });
                        $("#ExitConfirmModal").appendTo('body');
                        $("#ExitConfirmModal").modal('toggle');
                    } else {
                        $("#ProgramModal").modal('toggle');
                    }
                }
            });

            var progmPageFieldIDs = '#project_class,#project_name,#program_element_location_name,#program_element_total_value,' +
                '#program_element_Start_Date,#program_element_PO_Date,#program_element_PStart_Date,#program_element_PEnd_Date,' +
                '#Accounting_id,#Financial_Analyst_id,#Project_Manager_id,#Director_id,#Capital_Project_Assistant_id,#Vice_President_id,' +
                '#program_element_client_pm,#program_element_client_phone,#scope_quality_description';

            $(progmPageFieldIDs).unbind().on('input change paste', function (e) {
                isFieldValueChanged = true;
            });
            $('#cancel_program_element,#cancel_program_element_x').unbind('click').on('click', function () {
                if (isFieldValueChanged) {
                    dhtmlx.confirm("Unsaved data will be lost. Want to Continue?", function (result) {
                        if (result) {
                            if (wbsTree.unsavedChanges("ProgramElement")) {
                                //exitConfirm("ProgramElement");
                                $("#ProgramElementModal").css({ "opacity": "0.4" });
                                $("#ExitConfirmModal").appendTo('body');
                                $("#ExitConfirmModal").modal('toggle');
                            } else {
                                $("#ProgramElementModal").modal('toggle');
                            }
                            isFieldValueChanged = false;
                        }
                    });
                }
                else {
                    if (wbsTree.unsavedChanges("ProgramElement")) {
                        //exitConfirm("ProgramElement");
                        $("#ProgramElementModal").css({ "opacity": "0.4" });
                        $("#ExitConfirmModal").appendTo('body');
                        $("#ExitConfirmModal").modal('toggle');
                    } else {
                        $("#ProgramElementModal").modal('toggle');
                    }
                }
            });

            var proElePageFieldIDs = '#project_element_name,#project_element_locationName,#project_element_po_number,#project_element_amount,' +
                '#Accounting_Project_Element_id,#Financial_Analyst_Project_Element_id,#Project_Manager_Project_Element_id,#Director_Project_Element_id,' +
                '#Capital_Project_Assistant_Project_Element_id,#Vice_President_Project_Element_id,#project_element_description,#program_billing_poc1,' +
                '#program_billing_poc_phone_11,#program_billing_poc_phone_21,#program_billing_poc_email1,#program1_billing_poc_address_line1,#program1_billing_poc_address_line2,' +
                '#program1_billing_poc_city,#program1_billing_poc_state,#program1_billing_poc_po_num,#program_billing_poc_special_instruction1,' +
                '#program_tm_billing1,#program_sov_billing1,#program_monthly_billing1,#program_Lumpsum1';

            $(proElePageFieldIDs).unbind().on('input change paste', function (e) {
                isFieldValueChanged = true;
            });
            $('#cancel_project,#cancel_project_x').unbind('click').on('click', function () {
                debugger;
                if (isFieldValueChanged) {
                    dhtmlx.confirm("Unsaved data will be lost. Want to Continue?", function (result) {
                        if (result) {
                            if (wbsTree.unsavedChanges("Project")) {
                                //exitConfirm("Project");
                                $("#ProjectModal").css({ "opacity": "0.4" });
                                $("#ExitConfirmModal").appendTo('body');
                                $("#ExitConfirmModal").modal('toggle');
                            } else {
                              //  $("#emp_class").selectedIndex = -1;
                                $("#ProjectModal").modal('toggle');
                            }
                            //$("#emp_class").selectedIndex = -1;
                            isFieldValueChanged = false;
                        }
                    });
                }
                else {
                    if (wbsTree.unsavedChanges("Project")) {
                        //exitConfirm("Project");
                        $("#ProjectModal").css({ "opacity": "0.4" });
                        $("#ExitConfirmModal").appendTo('body');
                        $("#ExitConfirmModal").modal('toggle');
                    } else {
                       
                        $("#ProjectModal").modal('toggle');
                    }
                   
                }

               
                //$("#emp_class").multiselect('refresh');
                    //$("#emp_class").multipleSelect('refresh');
            });
            //=============================================================================================================
            //=========================  Jignesh-ModificationPopUpChanges =====================================================
            $('#btnModification').on('click', function () {

                $("#ProgramModal").css({ "opacity": "0.4" });  //Manasi 22-02-2021
                $('#DeleteUploadContModification').attr('disabled', 'disabled');
                $('#ViewUploadFileContModification').attr('disabled', 'disabled');
                $('#downloadBtnContModification').attr('disabled', 'disabled');
                if (wbsTree.getLocalStorage().acl[0] == 1 && wbsTree.getLocalStorage().acl[1] == 0) {
                    $("#updateDMBtnContModification").attr('disabled', 'disabled');
                }
                else {
                    $('#updateDMBtnContModification').removeAttr('disabled'); // Jignesh-24-02-2021
                }
                $('#modification_title').val('');
                $('#modification_reason').val('');
                $('#modification_date').val('');
                $('#modification_value').val('');
                //$('#duration_date').val('');
                $('#schedule_impact').val('');
                $('#modification_description').val('');
                $('#divModificationValue').show(); // Jignesh-03-03-2021
                $('#divModDurationDate').hide(); // Jignesh-08-02-2021
                var angularHttp = wbsTree.getAngularHttp();
                angularHttp.get(serviceBasePath + 'Request/GetModificationTypes').then(function (response) {
                    modificationTypeData = response.data.result;
                    modal = $('#mdlContractModification');
                    var modificationTypeDropDown = modal.find('.modal-body #ddModificationType');
                    modificationTypeDropDown.empty();

                    for (var x = 0; x < modificationTypeData.length; x++) {
                        //modificationTypeDropDown.append('<option selected="false">' + modificationTypeData[x].ModType + '</option>');
                        //modificationTypeDropDown.val('');
                        if (modificationTypeData[x].ModificationTypeId == 1) {
                            modificationTypeDropDown.append('<option value="' + modificationTypeData[x].ModificationTypeId + '" selected> ' + modificationTypeData[x].ModType + '</option>');
                            modificationTypeDropDown.val(modificationTypeData[x].ModificationTypeId);
                        } else {
                            modificationTypeDropDown.append('<option value="' + modificationTypeData[x].ModificationTypeId + '"> ' + modificationTypeData[x].ModType + '</option>');
                        }
                    }

                });
                _Document.getModificationByProgramId().get({ programId: wbsTree.getSelectedProgramID() }, function (response) {
                    _ModificationList = response.data;
                    $('#mdlContractModification').modal({ show: true, backdrop: 'static' });
                    var gridModification = $("#gridModificationList tbody")// modal.find('#gridUploadedDocumentProgram tbody');
                    gridModification.empty();
                    _ModificationList.reverse();
                    var ModList = _ModificationList;
                    if (!_IsRootForModification) {
                        if (_ModificationList.length > 0) {
                            for (var x = 0; x < ModList.length; x++) {
                                var durationDate = "";
                                if (_ModificationList[x].DurationDate != null) {
                                    durationDate = moment(_ModificationList[x].DurationDate).format('MM/DD/YYYY')
                                }
                                // Jignesh-17-02-2021
                                var modificationType = _ModificationList[x].ModificationType == 1 ? 'Value' :
                                    _ModificationList[x].ModificationType == 0 ? 'NA' :
                                        _ModificationList[x].ModificationType == 2 ? 'Schedule Impact' : 'Value & Schedule Impact';
                               

                                gridModification.append('<tr id="' + _ModificationList[x].Id + '">' +//<td style="width: 20px">' +
                                    //'<input id=rb' + _documentList[x].DocumentID + ' type="radio" name="rbCategories" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                                    //'</td >' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '><a>' + _ModificationList[x].ModificationNo + '</a></td> ' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width:200px;width:100%;"' +
                                    '>' + _ModificationList[x].Title + '</td>' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"' +
                                    '>' + modificationType + '</td>' + // Jignesh-17-02-2021
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '>' + '$' + _ModificationList[x].Value + '</td>' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    //'>' + durationDate + '</td>' +
                                    '>' + _ModificationList[x].ScheduleImpact + '</td>' +
                                    '<td>' + moment(_ModificationList[x].Date).format('MM/DD/YYYY') + '</td>' +
                                    '<tr > ');
                            }

                            $('#documentUploadContModification').removeAttr('title');    //Manasi 01-03-2021

                        }
                        //============================ Jignesh-24-02-2021 ===================================
                        else {
                            $('#updateDMBtnContModification').attr('disabled', 'disabled');
                            $('#documentUploadContModification').attr('title', "A modification needs to be saved before the document can be added");  //Manasi 01-03-2021

                        }
                        //===================================================================================
                    }
                });
                _Document.getDocumentByProjID().get({ DocumentSet: 'Program', ProjectID: _selectedProgramID }, function (response) {
                    wbsTree.setDocumentList(response.result);
                    var gridUploadedModDocument = $('#gridUploadedDocumentContModification tbody');
                    var modId = null;
                    var modTitle = null;
                    gridUploadedModDocument.empty();
                    for (var x = 0; x < _documentList.length; x++) {
                        if (_documentList[x].ModificationNumber >= 0 && _documentList[x].ModificationNumber != null) {
                            for (var i = 0; i < _ModificationList.length; i++) {
                                if (_documentList[x].ModificationNumber == _ModificationList[i].ModificationNo) {
                                    modId = _ModificationList[i].ModificationNo;
                                    modTitle = _ModificationList[i].Title;
                                }
                            }
                            gridUploadedModDocument.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesMod" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
                                '</td > <td ' +
                                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].DocumentTypeName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + modId + ' - ' + modTitle + '</td>' +
                                '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                '<tr > ');   //MM/DD/YYYY h:mm a'
                        }

                    }

                    var deleteDocBtn = modal.find('.modal-body #delete-doc');
                    deleteDocBtn.attr('disabled', _documentList.length > 0 ? false : true);

                    $('input[name=rbCategoriesMod]').on('click', function (event) {
                        if (wbsTree.getLocalStorage().acl[0] == 1 && wbsTree.getLocalStorage().acl[1] == 0) {
                            $('#ViewUploadFileContModification').removeAttr('disabled');
                        }
                        else {
                            $('#DeleteUploadContModification').removeAttr('disabled');
                            $('#ViewUploadFileContModification').removeAttr('disabled');
                            $('#downloadBtnContModification').removeAttr('disabled');
                        }

                    });

                });
            });

            // Jignesh-08-02-2021
            $('#ddModificationType').on('change', function () {
                var ddValue = $('#ddModificationType').val();
                if (ddValue == 1) {
                    $('#modification_value').val('');
                    /*$('#duration_date').val(''); */
                    $('#schedule_impact').val('');
                    $('#divModificationValue').show();
                    $('#divModDurationDate').hide();
                }
                else if (ddValue == 2) {
                    $('#modification_value').val('');
                    //$('#duration_date').val('');
                    $('#schedule_impact').val('');
                    $('#divModificationValue').hide();
                    $('#divModDurationDate').show();
                }
                else if (ddValue == 3) {
                    $('#modification_value').val('');
                    //$('#duration_date').val('');
                    $('#schedule_impact').val('');
                    $('#divModificationValue').show();
                    $('#divModDurationDate').show();
                }
            });

            $('#updateDMBtnContModification').unbind().on('click', function (event) {
                $('#DocUpdateModalContModification').modal({ show: true, backdrop: 'static' });
            });

            //======================================= Jignesh-AddNewDocModal-18-02-2021 ==========================================
            // Jignesh-22-02-2021 Add this id "document_type_trend" in below event
            $('#document_type_programContModification,#document_type_program,#document_type_programPrg,#document_type_programPrgElm,#document_type_trend').unbind().on('change', function (event) {
                if ($(this).val() == "Add New") {
                    var thisData = $(this);
                    wbsTree.setSelectedDocTypeDropDown(thisData.context.id);
                    //selectedDocTypeDropDown = thisData.context.id;
                    $('#addNewDocumentTypeModal').modal({ show: true, backdrop: 'static' });
                    $('#txtDocType').val('');
                    $('#txtDocDescription').val('');
                }
            });

            //=======================================================================================================
            //======================================= Jignesh-23-02-2021 this code is there just update ==========================================
            var idList = '#program_client_phone,#program_project_manager_phone,#program_billing_poc_phone_1,#program_billing_poc_phone_2,#program_element_client_phone,#program_billing_poc_phone_11,#program_billing_poc_phone_21';
            //$(idList).unbind().on('input blur paste', function () {
            //    $(this).val($(this).val().replace(/\D/g, ''));
            //});
            //================= Jignesh-25-02-2021 Replace below block of code =======================
            $(idList).unbind().on('input blur paste', function (e) {
                $(this).val($(this).val().replace(/\D/g, ''));
                if ($(this).val().match(/[0-9]/) == null) {
                    $(this).val($(this).val().replace(/\D/g, ''));
                    return;
                }
                else {
                    var number = this.value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                    this.value = number;
                }
            });
            //=======================================================================================================
            //====================== Jignesh-25-03-2021 =================================
            $("#modification_value,#program_element_change_order_amount_modal").keypress(function (e) {
                if (e.which != 46 && e.which != 45 && e.which != 46 &&
                    !(e.which >= 48 && e.which <= 57)) {
                    return false;
                }
                else {
                    $(this).val('$' + $(this).val().replace('$', ''));
                }
            });
            //============================================================================
            $('#DocUpdateModalContModification').unbind().on('show.bs.modal', function (event) {
                $("#ProgramModal").css({ "opacity": "0.4" });
                $("#ContModificationExecutionDatePrg").datepicker();
                modal = $(this);
                //load docTypeList
                var docTypeDropDownProgram = modal.find('.modal-body #document_type_programContModification');
                var docTypeList = wbsTree.getDocTypeList();
                docTypeDropDownProgram.empty();
                // Jignesh-25-03-2021
                if (wbsTree.getLocalStorage().role === "Admin") {
                    docTypeDropDownProgram.append('<option value="Add New"> ----------Add New---------- </option>');
                }
                for (var x = 0; x < docTypeList.length; x++) {
                    docTypeDropDownProgram.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                }
                docTypeDropDownProgram.val('');

                _Document.getModificationByProgramId().get({ programId: wbsTree.getSelectedProgramID() }, function (response) {
                    var modificationDropDown = modal.find('.modal-body #ddModificationType');
                    modificationDropDown.empty();
                    _ModificationList = response.data;
                    for (var x = 0; x < _ModificationList.length; x++) {
                        modificationDropDown.append('<option value="' + _ModificationList[x].ModificationNo + '"> ' + _ModificationList[x].ModificationNo + '-' + _ModificationList[x].Title + '</option>');
                    }
                    modificationDropDown.val('');
                });



                $('#ContModificationSpecialNotePrg').val(''); //Manasi
                $('#document_name_ContModification').val(''); //Manasi
                $('#ContModificationExecutionDatePrg').val(''); //Manasi
                $('#fileUploadContModification').val('');  //Manasi

            });
            //=================  Jignesh-ModificationPopUpChanges Ends here ==================================

            //------------------Manasi-----------------------------------------------------------------
            $('#ViewUploadFileProgramPrgElm').unbind().on('click', function (event) { //Manasi
                //  $('#PdfViewerPrgElm').modal({ show: true, backdrop: 'static' });
                $("#AadhariframePrgElm").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesPrgElm"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        //  alert('page content: ' + data);
                        //  $('#imgTest').attr('src', data);
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        //var base64 = data.split(';')[1];
                        //base64 = base64.split(',')[1];
                        //const blob = base64ToBlob(base64, type);
                        //const url = URL.createObjectURL(blob);
                        //$('#AadhariframePrgElm').attr('src', url);

                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframePrgElm').attr('src', url);
                            $('#PdfViewerPrgElm').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );

            });

            //----------------------- Swapnil document management element level---------------------------------------------

            $('#ViewUploadFileInViewAllProgramElement').unbind().on('click', function (event) { //Manasi
                //  $('#PdfViewerPrgElm').modal({ show: true, backdrop: 'static' });
                $("#AadhariframePrgElm").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesPrgElm"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframePrgElm').attr('src', url);
                            $('#PdfViewerPrgElm').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );

            });

            //-------------------------------------------------------------------------------------------------

            //----------------------- Swapnil document management project level---------------------------------------------

            $('#ViewUploadFileInViewAllProject').unbind().on('click', function (event) { //Manasi
                //  $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                $("#AadhariframePrg").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategoriesPrg"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        //  alert('page content: ' + data);
                        //  $('#imgTest').attr('src', data);
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        //var base64 = data.split(';')[1];
                        //base64 = base64.split(',')[1];
                        //const blob = base64ToBlob(base64, type);
                        //const url = URL.createObjectURL(blob);
                        //$('#AadhariframePrg').attr('src', url);


                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#AadhariframePrg').attr('src', url);
                            $('#PdfViewerPrg').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }



                    }
                );

            });

            //-------------------------------------------------------------------------------------------------

            //--------------------------------- Swapnil document management contract level ----------------------

            $('#ViewUploadFileInViewAllContracts').unbind().on('click', function (event) {  //Manasi
                // $('#PdfViewer').modal({ show: true, backdrop: 'static' });
                $("#Aadhariframe").attr('src', '');
                var RbUpload = document.querySelector('input[name = "rbCategories"]:checked').value;

                //Pritesh img

                $.get(
                    RbUpload,
                    function (data) {
                        //  alert('page content: ' + data);
                        //  $('#imgTest').attr('src', data);
                        var type = data.split(';')[0];
                        type = type.split(':')[1];
                        //var base64 = data.split(';')[1];
                        //base64 = base64.split(',')[1];
                        //const blob = base64ToBlob(base64, type);
                        //const url = URL.createObjectURL(blob);
                        //$('#Aadhariframe').attr('src', url);
                        // alert(type.replace("application\",""));
                        var n = type.lastIndexOf('/');
                        var result = type.substring(n + 1);
                        // alert(result);
                        var extensions = ["pdf", "jpg", "jpeg", "bmp", "gif", "png", "txt", "plain"];
                        var correct = false;

                        // Loop through the extension list
                        for (var i = 0; i < extensions.length; i++) {
                            // Check if the file url ends with the given extension
                            if (result == extensions[i]) {
                                // All conditions met, set to true!
                                correct = true;
                            }
                        }


                        if (correct) {
                            // Yay, it's correct!
                            var base64 = data.split(';')[1];
                            base64 = base64.split(',')[1];
                            const blob = base64ToBlob(base64, type);
                            const url = URL.createObjectURL(blob);
                            $('#Aadhariframe').attr('src', url);
                            $('#PdfViewer').modal({ show: true, backdrop: 'static' });
                        }
                        else {
                            // It's wrong, show something else!
                            dhtmlx.alert("File type does not support the view. To view this file type, please download the file first.");
                        }
                    }
                );

            });

            //-------------------------------------------------------------------------------------------------

            function base64ToBlob(base64, type = "application/octet-stream") {
                const binStr = atob(base64);
                const len = binStr.length;
                const arr = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }
                return new Blob([arr], { type: type });
            }

            //---------------------------------------------------------------------------------------

            $('#PdfViewerPrgElm').unbind().on('show.bs.modal', function (event) {
                $("#ProjectModal").css({ "opacity": "0.4" });
            });

            $('#DeleteUploadProgramPrgElm').unbind().on('click', function (event) {  //Manasi
                dhtmlx.confirm("Delete selected document?", function (result) { // Jignesh-24-02-2021 {Remove 's' from document}
                    //console.log(result);
                    if (result) {
                        var deleteDocBtn = $('#DeleteUploadProgramPrgElm');
                        deleteDocBtn.attr('disabled', true);
                        // Disable File Upload Delete and View button
                        $('#DeleteUploadProgramPrgElm').attr('disabled', 'disabled');
                        $('#ViewUploadFileProgramPrgElm').attr('disabled', 'disabled');
                        $('#EditBtnProgramPrgElm').attr('disabled', 'disabled');
                        $('#downloadBtnProgramPrgElm').attr('disabled', 'disabled'); //Manasi

                        $("#gridUploadedDocumentProgramNewPrgElm tbody").find('input[name="rbCategoriesPrgElm"]').each(function () {
                            if ($(this).is(":checked")) {
                                //alert($(this).parents("tr").attr('id'));
                                console.log($(this).parents("tr").attr('id'));
                                // alert($(this).parents("tr").attr('id'));

                                _Document.delByDocIDs()
                                    .get({ "docIDs": $(this).parents("tr").attr('id').toString() }, function (response) {
                                        console.log(response);
                                        if (response.result == "Deleted") {
                                            wbsTree.setDeleteDocIDs(null);
                                        } else {
                                            dhtmlx.alert('Error trying to delete Uploaded Documents.');
                                        }
                                    });
                                wbsTree.setDeleteDocIDs($(this).parents("tr").attr('id'));
                                $(this).parents("tr").remove();
                            }
                            else {
                                //  deleteDocBtn.attr('disabled', false);
                            }
                        });
                    }
                });
            });


            // 3 Pritesh pop up for Project Element
            async function getApprovalMatrix() {
                var angularHttp = wbsTree.getAngularHttp();
                return angularHttp.get(serviceBasePath + 'request/approvalmatrix').then(function (approversData) {

                    var employeeList = wbsTree.getEmployeeList();
                    var userList = wbsTree.getUserList();
                    var newEmployeeList = [];
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                            newEmployeeList.push(employeeList[x]);
                            break;
                        }
                    }

                    for (var x = 0; x < userList.length; x++) {
                        for (var y = 0; y < employeeList.length; y++) {
                            if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                                newEmployeeList.push(employeeList[y]);
                                break;
                            }
                        }
                    }
                    employeeList = newEmployeeList;
                    $('#divProjectElememtApprovers').html('');
                    var approvers = approversData.data.result;
                    if (approvers != null && approvers.length > 0) {

                        var totalRows = ~~(approvers.length / 2);
                        var remainderCol = approvers.length % 2;
                        var append = '';

                        if (remainderCol > 0) {
                            totalRows++;
                        }
                        console.log(employeeList);
                        var currentNum = 0;
                        if (totalRows > 0) {
                            //var marginBottom = 150;
                            for (var i = 0; i < totalRows; i++) {
                                //append += "<div class='_form-group' style='margin-bottom: " + marginBottom+"px'>";
                                append += "<div class='_form-group'>";
                                for (var j = 0; j < 2; j++) {
                                    var labelText = approvers[currentNum].Role;
                                    var ddlId = labelText.replace(/ +/g, "_");
                                    var dbid = approvers[currentNum].Id;
                                    if (j == 0) {
                                        append += "<div class='col-xs-6' style='padding-left: 0;'>" +
                                            "<label class='control-label _bold required'>" + labelText + "</label>" +
                                            "<select type='text' class='form-control' id='" + ddlId + "_Project_Element_id' dbid='" + dbid + "'>";
                                        for (var x = 0; x < employeeList.length; x++) {
                                            if (employeeList[x].Name != null) { //universal
                                                append += '<option value="' + employeeList[x].ID + '">' + employeeList[x].Name + '</option>';
                                            }

                                        }
                                    } else {
                                        append += "<div class='col-xs-6' style='padding-left: 0;padding-right: 0;margin-bottom: 15px;'>" +
                                            "<label class='control-label _bold required'>" + labelText + "</label>" +
                                            "<select type='text' class='form-control' id='" + ddlId + "_Project_Element_id' dbid='" + dbid + "'>";
                                        for (var x = 0; x < employeeList.length; x++) {
                                            if (employeeList[x].Name != null) { //universal
                                                append += '<option value="' + employeeList[x].ID + '">' + employeeList[x].Name + '</option>';
                                            }

                                        }
                                    }

                                    append += "</select>";
                                    append += "</div>";
                                    currentNum++;
                                    if (currentNum == approvers.length) {

                                        break;
                                    }
                                }
                                append += "</div>";
                            }
                            $('#divProjectElememtApprovers').append(append);

                        }

                    }
                    
                });
            }
            //luan quest 3/22 - ON SHOW PROJECT ELEMENT
            $('#ProjectModal').unbind().on('show.bs.modal', function (event) {
                var angularHttp = wbsTree.getAngularHttp();
                modal = $(this);
                if (displayMap) {
                    selectedNode = wbsTree.getSelectedNode();
                }
                else {
                    if (type != "ProgramElement") {

                        if (SelectedProjectId) {
                            $.each(Treedata.children, function (i, Contract) {
                                if (Contract.children) {
                                    $.each(Contract.children, function (j, Project) {
                                        if (Project.children) {
                                            $.each(Project.children, function (k, Element) {

                                                if (Element.ProjectID == SelectedProjectId) {
                                                    selectedNode = Element;
                                                    wbsTree.setSelectedNode(selectedNode);
                                                }

                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    

                }

                defaultModalPosition();

                $('#DeleteUploadProgramPrgElm').attr('disabled', 'disabled');
                $('#ViewUploadFileProgramPrgElm').attr('disabled', 'disabled');
                $('#EditBtnProgramPrgElm').attr('disabled', 'disabled');
                $('#downloadBtnProgramPrgElm').attr('disabled', 'disabled');    //Manasi

                //using on('click','li') will activate on li's click

                //Buttons click events
                //ADD HIGHLIGHTED
                $('#addProjectWhiteListBtn').click(function () {
                    var selected = $('.picklist').find('.select.selected select');
                    var available = $('.picklist').find('.select.available select');
                    console.log(available.val());
                    var highlightedAvailable = available.val();

                    var employeeList = available[0];
                    var afterMathEmployeeList = [];
                    for (var x = 0; x < employeeList.length; x++) {
                        afterMathEmployeeList.push({
                            id: employeeList[x].id,
                            label: employeeList[x].label,
                            value: employeeList[x].value
                        });
                    }
                    console.log(employeeList);

                    for (var x = 0; x < employeeList.length; x++) {
                        var inHighlightedAvailable = false;
                        var inSelected = false;

                        for (var y = 0; y < highlightedAvailable.length; y++) {
                            if (employeeList[x].id == highlightedAvailable[y]) {
                                inHighlightedAvailable = true;
                                break;
                            }
                        }

                        for (var y = 0; y < selected[0].length; y++) {
                            if (employeeList[x].id == selected[0][y].id) {
                                inSelected = true;
                                break;
                            }
                        }

                        //console.log(inHighlightedAvailable, !inSelected, employeeList[x].Name);

                        console.log(inHighlightedAvailable, !inSelected);

                        if (inHighlightedAvailable && !inSelected) {
                            console.log(highlightedAvailable, employeeList[x]);
                            selected.append($("<option></option>").attr("id", employeeList[x].id).attr("label", employeeList[x].label).attr("value", employeeList[x].id));

                            for (var y = afterMathEmployeeList.length - 1; y >= 0; y--) {
                                if (afterMathEmployeeList[y].id == employeeList[x].id) {
                                    afterMathEmployeeList.splice(y, 1);
                                    break;
                                }
                            }
                        }
                    }

                    available.empty();

                    console.log(afterMathEmployeeList);

                    for (var x = 0; x < afterMathEmployeeList.length; x++) {
                        available.append($("<option></option>").attr("id", afterMathEmployeeList[x].id).attr("label", afterMathEmployeeList[x].label).attr("value", afterMathEmployeeList[x].id));
                    }
                });

                //ADD ALL
                $('#addAllProjectWhiteListBtn').click(function () {
                    var selected = $('.picklist').find('.select.selected select');
                    var available = $('.picklist').find('.select.available select');

                    var employeeList = available[0];
                    var afterMathEmployeeList = [];
                    for (var x = 0; x < employeeList.length; x++) {
                        afterMathEmployeeList.push({
                            id: employeeList[x].id,
                            label: employeeList[x].label,
                            value: employeeList[x].value
                        });
                    }
                    console.log(employeeList);

                    for (var x = 0; x < employeeList.length; x++) {
                        var inSelected = false;

                        for (var y = 0; y < selected[0].length; y++) {
                            if (employeeList[x].id == selected[0][y].id) {
                                inSelected = true;
                                break;
                            }
                        }

                        var inHighlightedAvailable = true;

                        if (inHighlightedAvailable && !inSelected) {
                            selected.append($("<option></option>").attr("id", employeeList[x].id).attr("label", employeeList[x].label).attr("value", employeeList[x].id));

                            for (var y = afterMathEmployeeList.length - 1; y >= 0; y--) {
                                if (afterMathEmployeeList[y].id == employeeList[x].id) {
                                    afterMathEmployeeList.splice(y, 1);
                                    break;
                                }
                            }
                        }
                    }

                    available.empty();

                    console.log(afterMathEmployeeList);

                    for (var x = 0; x < afterMathEmployeeList.length; x++) {
                        available.append($("<option></option>").attr("id", afterMathEmployeeList[x].id).attr("label", afterMathEmployeeList[x].label).attr("value", afterMathEmployeeList[x].id));
                    }
                });

                //REMOVE HIGHLIGHTED
                $('#removeProjectWhiteListBtn').click(function () {
                    var selected = $('.picklist').find('.select.selected select');
                    var available = $('.picklist').find('.select.available select');
                    console.log(selected.val());
                    var highlightedSelected = selected.val();

                    var employeeList = selected[0];
                    var afterMathEmployeeList = [];
                    for (var x = 0; x < employeeList.length; x++) {
                        afterMathEmployeeList.push({
                            id: employeeList[x].id,
                            label: employeeList[x].label,
                            value: employeeList[x].value
                        });
                    }
                    console.log(employeeList);

                    for (var x = 0; x < employeeList.length; x++) {
                        var inHighlightedSelected = false;
                        var inAvailable = false;

                        for (var y = 0; y < highlightedSelected.length; y++) {
                            if (employeeList[x].id == highlightedSelected[y]) {
                                inHighlightedSelected = true;
                                break;
                            }
                        }

                        for (var y = 0; y < available[0].length; y++) {
                            if (employeeList[x].id == available[0][y].id) {
                                inAvailable = true;
                                break;
                            }
                        }

                        //console.log(inHighlightedAvailable, !inSelected, employeeList[x].Name);

                        console.log(inHighlightedSelected, !inAvailable);

                        if (inHighlightedSelected && !inAvailable) {
                            console.log(highlightedSelected, employeeList[x]);
                            available.append($("<option></option>").attr("id", employeeList[x].id).attr("label", employeeList[x].label).attr("value", employeeList[x].id));

                            for (var y = afterMathEmployeeList.length - 1; y >= 0; y--) {
                                if (afterMathEmployeeList[y].id == employeeList[x].id) {
                                    afterMathEmployeeList.splice(y, 1);
                                    break;
                                }
                            }
                        }
                    }

                    selected.empty();

                    console.log(afterMathEmployeeList);

                    for (var x = 0; x < afterMathEmployeeList.length; x++) {
                        selected.append($("<option></option>").attr("id", afterMathEmployeeList[x].id).attr("label", afterMathEmployeeList[x].label).attr("value", afterMathEmployeeList[x].id));
                    }
                });

                //REMOVE ALL
                $('#removeAllProjectWhiteListBtn').click(function () {
                    var selected = $('.picklist').find('.select.selected select');
                    var available = $('.picklist').find('.select.available select');

                    var employeeList = selected[0];
                    var afterMathEmployeeList = [];
                    for (var x = 0; x < employeeList.length; x++) {
                        afterMathEmployeeList.push({
                            id: employeeList[x].id,
                            label: employeeList[x].label,
                            value: employeeList[x].value
                        });
                    }
                    console.log(employeeList);

                    for (var x = 0; x < employeeList.length; x++) {
                        var inAvailable = false;

                        for (var y = 0; y < available[0].length; y++) {
                            if (employeeList[x].id == available[0][y].id) {
                                inAvailable = true;
                                break;
                            }
                        }

                        //console.log(inHighlightedAvailable, !inSelected, employeeList[x].Name);

                        var inHighlightedSelected = true;

                        console.log(inHighlightedSelected, !inAvailable);

                        if (inHighlightedSelected && !inAvailable) {
                            available.append($("<option></option>").attr("id", employeeList[x].id).attr("label", employeeList[x].label).attr("value", employeeList[x].id));

                            for (var y = afterMathEmployeeList.length - 1; y >= 0; y--) {
                                if (afterMathEmployeeList[y].id == employeeList[x].id) {
                                    afterMathEmployeeList.splice(y, 1);
                                    break;
                                }
                            }
                        }
                    }

                    selected.empty();

                    console.log(afterMathEmployeeList);

                    for (var x = 0; x < afterMathEmployeeList.length; x++) {
                        selected.append($("<option></option>").attr("id", afterMathEmployeeList[x].id).attr("label", afterMathEmployeeList[x].label).attr("value", afterMathEmployeeList[x].id));
                    }
                });


                //luan whitelist
                //g_picklist_instance.pickList('initData');
                var selected = $('.picklist').find('.select.selected select');
                var available = $('.picklist').find('.select.available select');
                selected.empty();
                available.empty();

                var whiteList = [];
                var allTredndData;

                if (selectedNode.ProjectID) {

                    //------------------------------------------Swapnil 04-09-2020 ----------------------------------------------------------------

                    _Trend.lookup().get({
                        ProgramID: 'null', ProgramElementID: 'null', ProjectID: selectedNode.ProjectID, TrendNumber: 'null', KeyStroke: 'null'
                    }, function (response) {
                        console.log(response);
                        allTredndData = response.result;

                        for (var x = 0; x < allTredndData.length; x++) {

                            if (allTredndData[x].TrendStatusID == '3' && allTredndData[x].CurrentThreshold != null) {


                                var approversDdl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers select');
                                for (var i = 0; i < approversDdl.length; i++) {
                                    $('#' + approversDdl[i].id).attr("disabled", true);
                                }
                                break;

                            }
                            else {


                                var approversDdl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers select');
                                for (var i = 0; i < approversDdl.length; i++) {
                                    $('#' + approversDdl[i].id).attr("disabled", false);
                                }

                            }
                        }
                    });

                    //--------------------------------------------------------------------------------------------------------------------------------


                    wbsTree.getProjectWhiteListService().get({}, function (response) {
                        console.log(response);
                        wholeProjectWhiteList = response.result;

                        console.log(wholeProjectWhiteList);

                        for (var x = 0; x < wholeProjectWhiteList.length; x++) {
                            if (wholeProjectWhiteList[x].ProjectID == selectedNode.ProjectID) {
                                whiteList.push(wholeProjectWhiteList[x]);
                            }
                        }

                        var employeeList = wbsTree.getEmployeeList();
                        console.log(employeeList);
                        console.log(whiteList);

                        for (var x = 0; x < employeeList.length; x++) {
                            //------------------------------ Swapnil changes 31-08-2020 --------------------------------------------

                            //if (employeeList[x].ID == selectedNode.ProjectManagerID) {    //Project manager
                            //    projectManagerName = employeeList[x].Name;
                            //}
                            //if (employeeList[x].ID == selectedNode.DirectorID) {    //Director
                            //    directorName = employeeList[x].Name;
                            //}
                            //if (employeeList[x].ID == selectedNode.SchedulerID) {    //Scheduler
                            //    schedulerName = employeeList[x].Name;
                            //}
                            //if (employeeList[x].ID == selectedNode.VicePresidentID) {    //Vice president
                            //    vicePresidentName = employeeList[x].Name;
                            //}
                            //if (employeeList[x].ID == selectedNode.FinancialAnalystID) {    //Financial analyst
                            //    financialAnalystName = employeeList[x].Name;
                            //}
                            //if (employeeList[x].ID == selectedNode.CapitalProjectAssistantID) {    //Capital project assistant
                            //    capitalProjectAssistantName = employeeList[x].Name;
                            //}


                            //projectManagerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                            //directorDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                            //schedulerDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                            //vicePresidentDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                            //financialAnalystDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');
                            //capitalProjectAssistantDropDown.append('<option selected="false">' + employeeList[x].Name + '</option>');

                            // //----------------------------------------------------------------------------------------------------------
                            var inAvailable = true;
                            for (var y = 0; y < whiteList.length; y++) {
                                if (employeeList[x].ID == whiteList[y].EmployeeID) {
                                    inAvailable = false;
                                }
                            }

                            if (inAvailable) {
                                available.append($("<option></option>").attr("id", employeeList[x].ID).attr("label", employeeList[x].Name).attr("value", employeeList[x].ID));
                            } else {
                                selected.append($("<option></option>").attr("id", employeeList[x].ID).attr("label", employeeList[x].Name).attr("value", employeeList[x].ID));
                            }
                        }
                        ////------------------------------ Swapnil changes 31-08-2020 --------------------------------------------

                        //projectManagerDropDown.val(projectManagerName);
                        //directorDropDown.val(directorName);
                        //schedulerDropDown.val(schedulerName);
                        //vicePresidentDropDown.val(vicePresidentName);
                        //financialAnalystDropDown.val(financialAnalystName);
                        //capitalProjectAssistantDropDown.val(capitalProjectAssistantName);

                        ////----------------------------------------------------------------------------------------------------------
                    });
                }



                if (displayMap) {
                    selectedNode = wbsTree.getSelectedNode();
                }
                else {
                    if (type != "ProgramElement") {

                    if (SelectedProjectId) {

                        }
                    }

                }
                console.log(selectedNode);
                var s = wbsTree.getOrgProjectName();
                _selectedProgramElement = {};

                //Get Program Element (Super Project) info here
                wbsTree.getProgramElement().lookup().get({ ProgramID: 'null', ProgramElementID: selectedNode.ProgramElementID }, function (response) {
                    console.log(response);
                    _selectedProgramElement = response.result[0];
                });


                console.log(modal);

                //----------------------------Swapnil 27/10/2020 ----------------------------------------------

             //   getApprovalMatrix();

                //---------------------------------------------------------------------------------------------

                if (selectedNode.level == "Project") {
                    modal_mode = 'Update';
                    g_newProject = false;
                    wbsTree.setIsProjectNew(false);
                    _Is_Project_New = false;
                    populateProjectElementMilestoneTable(selectedNode.ProjectID);

                    $('#project_element_class').prop('disabled', true);
                    $('#service_class').prop('disabled', true);
                    //$('#service_class').val(SelectedNode.Description);
                    $('#emp_classDiv').show();

                    $('#documentUploadProgramNewPrgElm').removeAttr('title');   //Manasi 23-02-2021
                    $('#delete_project').removeAttr('disabled');  //Manasi 24-02-2021
                    $('#spnBtndelete_project').removeAttr('title');  //Manasi 24-02-2021

                    //luan Jquery - luan here
                    $('#project_class').prop('disabled', true);
                    $("#element_start_date").datepicker();	//datepicker - project
                    $("#element_end_date").datepicker();	//datepicker - project
                    var orgId = $("#selectOrg").val();
                    if (selectedNode.ProjectNumber == null || selectedNode.ProjectNumber == '') {
                        wbsTree.getProjectElementNumber().get({ ProjectNumber: selectedNode.ProjectNumber, OrganizationID: orgId }, function (response) {
                            console.log(response);
                            selectedNode.ProjectElementNumber = response.result;
                            modal.find('.modal-body #project_element_number').val(selectedNode.ProjectElementNumber);
                            dhtmlx.alert('This project previously had no project element #. A project element # was auto-generated, please remember to save.');
                        });
                    } else {
                        modal.find('.modal-body #project_element_number').val(selectedNode.ProjectElementNumber);
                    }

                    //get trend 0
                    console.log(selectedNode);
                    var costOverHeadType = "";
                    wbsTree.getTrendId().get({ trendId: 0, projectId: selectedNode.ProjectID }, function (response) {
                        console.log(response);
                        if (response.result) {
                            selectedNode.CostOverheadTypeID = response.result.CostOverheadTypeID;
                            for (var x = 0; x < costOverheadTypes.length; x++) {
                                if (costOverheadTypes[x].ID == selectedNode.CostOverheadTypeID) {
                                    costOverHeadType = costOverheadTypes[x].CostOverHeadType;
                                    modal.find('.modal-body #labor_rate_id').val(costOverHeadType);
                                    modal.find('.modal-body #labor_rate_id').attr('disabled', true);
                                }
                            }
                        }
                    });

                    $('#updateBtnProgramPrgElm').removeAttr('disabled');

                    var path = serviceBasePath + 'Request/VersionDetails/1/' + selectedNode.ProjectID + '/0';

                    angularHttp.get(path).then(function (response) {
                        var data = response.data.result[0];
                        modal.find('.modal-title').text('Project Element: ' + selectedNode.ProjectName + '  ' + ' / WBS vesrion: ' + data.description);
                    });

                    modal.find('.modal-title').text('Project Element: ' + selectedNode.ProjectName);	//luan eats
                    modal.find('.modal-body #project_name').val(selectedNode.ProjectName);		//luan eats
                    modal.find('.modal-body #project_element_name').val(selectedNode.ProjectName);	//luan eats
                    modal.find('.modal-body #project_manager').val(selectedNode.ProjectManager);
                    //modal.find('.modal-body #service_class').val(selectedNode.ProjectName);
                    //modal.find('.modal-body #project_sponsor').val(selectedNode.ProjectSponsor);
                    //modal.find('.modal-body #director').val(selectedNode.Director);
                    //modal.find('.modal-body #scheduler').val(selectedNode.Scheduler);
                    //modal.find('.modal-body #exec_steering_comm').val(selectedNode.ExecSteeringComm);
                    //modal.find('.modal-body #vice_president').val(selectedNode.VicePresident);
                    //modal.find('.modal-body #financial_analyst').val(selectedNode.FinancialAnalyst);
                    //modal.find('.modal-body #capital_project_assistant').val(selectedNode.CapitalProjectAssistant);
                    //modal.find('.modal-body #cost_description').val(selectedNode.CostDescription);
                    //modal.find('.modal-body #schedule_description').val(selectedNode.ScheduleDescription);
                    //modal.find('.modal-body #scope_quality_description').val(selectedNode.ScopeQualityDescription);
                    //modal.find('.modal-body #labor_rate').val('');


                    // Pritesh Billing POC 
                    modal.find('.modal-body #program_billing_poc1').val(selectedNode.BillingPOC);
                    modal.find('.modal-body #program_billing_poc_phone_11').val(selectedNode.BillingPOCPhone1);
                    modal.find('.modal-body #program_billing_poc_phone_21').val(selectedNode.BillingPOCPhone2);
                    modal.find('.modal-body #program_billing_poc_email1').val(selectedNode.BillingPOCEmail);

                    //===================== Jignesh-AddAddressField-21-01-2021 =================================
                    //modal.find('.modal-body #program_billing_poc_address1').val(selectedNode.BillingPOCAddress);
                    modal.find('.modal-body #program1_billing_poc_address_line1').val(selectedNode.BillingPOCAddressLine1);
                    modal.find('.modal-body #program1_billing_poc_address_line2').val(selectedNode.BillingPOCAddressLine2);
                    modal.find('.modal-body #program1_billing_poc_city').val(selectedNode.BillingPOCCity);
                    modal.find('.modal-body #program1_billing_poc_state').val(selectedNode.BillingPOCState);
                    modal.find('.modal-body #program1_billing_poc_po_num').val(selectedNode.BillingPOCPONo);
                    //===========================================================================================
                    //---------------------Swapnil 18/09/2020--------------------------------------------------
                    if (selectedNode.BillingPOCSpecialInstruction != null && selectedNode.BillingPOCSpecialInstruction != "") {
                        modal.find('.modal-body #program_billing_poc_special_instruction1').val(selectedNode.BillingPOCSpecialInstruction.replace('u000a', '\r\n'));
                    }
                    //----------------------------------------------------------------------------------------
                    // Check
                    document.getElementById("program_tm_billing1").checked = selectedNode.TMBilling ? true : false;
                    document.getElementById("program_sov_billing1").checked = selectedNode.SOVBilling ? true : false;
                    document.getElementById("program_monthly_billing1").checked = selectedNode.MonthlyBilling ? true : false;
                    document.getElementById("program_Lumpsum1").checked = selectedNode.Lumpsum ? true : false;
                    document.getElementById("program_certified_payroll1").checked = selectedNode.CertifiedPayroll ? true : false;


                    //project element
                    modal.find('.modal-body #project_element_po_number').val(selectedNode.ClientPONumber);
                    modal.find('.modal-body #project_element_amount').val(selectedNode.Amount);
                    modal.find('.modal-body #project_element_quickbookJobNumber').val(selectedNode.QuickbookJobNumber);
                    modal.find('.modal-body #project_element_locationName').val(selectedNode.LocationName);
                    modal.find('.modal-body #project_element_location').val(selectedNode.Location);
                    modal.find('.modal-body #project_element_number').val(selectedNode.ProjectElementNumber);
                    modal.find('.modal-body #project_element_description').val(selectedNode.ProjectDescription.replace('u000a', '\r\n'));

                    //luan here
                    modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                    modal.find('.modal-body #contract_number').val(selectedNode.ContractNumber);
                    modal.find('.modal-body #element_start_date').val(selectedNode.ProjectStartDate);   //datepicker - project
                    modal.find('.modal-body #element_end_date').val(selectedNode.ContractStartDate);		//datepicker - project

                    //luan here
                    //Populate project types for dropdown
                    //Find the project type name given the id
                    var projectTypeDropDown = modal.find('.modal-body #project_type');
                    console.log(projectTypeDropDown);
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var projectTypeName = '';
                    projectTypeDropDown.empty();

                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeID == selectedNode.ProjectTypeID) {
                            projectTypeName = projectTypeList[x].ProjectTypeName
                        }

                        if (projectTypeList[x].ProjectTypeName == null) {
                            continue;
                        }
                        projectTypeDropDown.append('<option selected="false">' + projectTypeList[x].ProjectTypeName + '</option>');
                    }
                    console.log(projectTypeName, selectedNode.ProjectTypeID);
                    projectTypeDropDown.val(projectTypeName);

                    //Populate project classes for dropdown
                    //Find the project class name given the id
                    var projectClassDropDown = modal.find('.modal-body #project_element_class');
                    var projectClassList = wbsTree.getProjectClassList();
                    var projectClassName = '';
                    projectClassDropDown.empty();

                    for (var x = 0; x < projectClassList.length; x++) {
                        if (projectClassList[x].ProjectClassID == selectedNode.ProjectClassID) {
                            projectClassName = projectClassList[x].ProjectClassName
                        }

                        if (projectClassList[x].ProjectClassName == null) {
                            continue;
                        }
                        projectClassDropDown.append('<option selected="false">' + projectClassList[x].ProjectClassName + '</option>');
                    }
                    projectClassDropDown.val(projectClassName);

                    //Populate project classes for dropdown
                    //Find the project class name given the id
                    var serviceClassDropDown = modal.find('.modal-body #service_class');
                    var serviceClassList = wbsTree.getServiceClassList();
                    var projectClassName = '';
                    serviceClassDropDown.empty();

                    for (var x = 0; x < serviceClassList.length; x++) {
                        if (serviceClassList[x].ID == selectedNode.ProjectClassID) {
                            projectClassName = serviceClassList[x].Description
                        }

                        if (serviceClassList[x].Description == null) {
                            continue;
                        }
                        serviceClassDropDown.append('<option>' + serviceClassList[x].Description + '</option>');
                    }
                    serviceClassDropDown.val(projectClassName.trim());

                    //Populate employee classes for dropdown 
                    //Find the employee selected names given the id
                    var employeeDetails = [];
                   
                    console.log("EMployee list==");
                    console.log(employeeList);
                    // $("#emp_class").val(employeeDetails);
                    var employeeClassDropDown = $('#ProjectModal').find('.modal-body #emp_class');
                    var employeeList = wbsTree.getEmployeeList();
                    var userList = wbsTree.getUserList();
                    var newEmployeeList = [];
                    /*
                                        for (var x = 0; x < employeeList.length; x++) {
                                            if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                                                newEmployeeList.push(employeeList[x]);
                                                break;
                                            }
                                        }*/

                    for (var x = 0; x < userList.length; x++) {
                        for (var y = 0; y < employeeList.length; y++) {
                            if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                                newEmployeeList.push(userList[x]);
                                break;
                            }
                        }
                    }
                    employeeList = newEmployeeList;
                    var employeeClassList = employeeList;
              
                    
                   
                    employeeClassDropDown.empty();
                    debugger;
                  
                    var dataarray = [];
                    var empList = [];
                   /* for (a = 0; a < selectedNode.employeeAllowedList.length; a++) {
                        empList.push(parseInt(selectedNode.employeeAllowedList[a]));
                    }*/

                    angular.forEach(selectedNode.employeeAllowedList, function (item) {
                        empList.push(parseInt(item));
                            //total += parseFloat(item.CurrentCost);
                    });

                    for (var x = 0; x < employeeClassList.length; x++) {
                        var fullName = '';
                        fullName = employeeClassList[x].FirstName + " " + employeeClassList[x].LastName;
                        var empId = parseInt(employeeClassList[x].Id);
                        if (empList != undefined && empList.includes(empId)) {
                               // empClassName = employeeClassList[x].Name;
                             dataarray.push(empId);
                               employeeClassDropDown.append('<option value=' + employeeClassList[x].Id + ' selected="true">' + fullName + '</option>');
                               
                        }         else {
                        
                                 employeeClassDropDown.append('<option value=' + employeeClassList[x].Id + '>' + fullName + '</option>');

                        }

                        if (fullName == null) {
                            continue;
                        }

                    }
                    $('#emp_class').multiselect({
                        // columns: 5,
                        clearButton: true,
                        search: false,
                        selectAll: false,
                        // rebuild : true,
                        nonSelectedText: '-- Select --',
                        numberDisplayed: 1

                    });
                    employeeClassDropDown.val(dataarray);
                    employeeClassDropDown.multiselect('refresh');



                    //Populate clients for dropdown
                    //Find the client name given the id
                    var clientDropDown = modal.find('.modal-body #client');
                    var clientList = wbsTree.getClientList();
                    var clientName = '';
                    clientDropDown.empty();

                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientID == selectedNode.ClientID) {
                            clientName = clientList[x].ClientName
                        }

                        if (clientList[x].ClientName == null) {
                            continue;
                        }
                        clientDropDown.append('<option selected="false">' + clientList[x].ClientName + '</option>');
                    }
                    clientDropDown.val(clientName);

                    //Populate project locations for dropdown
                    //Find the location name given the id
                    var locationDropDown = modal.find('.modal-body #project_element_location');
                    var locationList = wbsTree.getLocationList();
                    var locationName = '';
                    locationDropDown.empty();

                    for (var x = 0; x < locationList.length; x++) {
                        if (locationList[x].LocationID == selectedNode.LocationID) {
                            locationName = locationList[x].LocationName
                        }

                        if (locationList[x].LocationName == null) {
                            continue;
                        }
                        locationDropDown.append('<option selected="false">' + locationList[x].LocationName + '</option>');
                    }
                    locationDropDown.val(locationName);

                    //populate docTypeList
                    var docTypeDropDownProject = modal.find('.modal-body #document_type_project');
                    var docTypeList = wbsTree.getDocTypeList();
                    docTypeDropDownProject.empty();

                    for (var x = 0; x < docTypeList.length; x++) {
                        docTypeDropDownProject.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                    }

                    docTypeDropDownProject.val('');

                    //Enable upload button for edit Project
                    var uploadBtnProject = modal.find('.modal-body #uploadBtnProject');
                    uploadBtnProject.attr('disabled', false);
                    // Disable File Upload Delete and View button
                    $('#DeleteUploadProgramPrgElm').attr('disabled', 'disabled');
                    $('#ViewUploadFileProgramPrgElm').attr('disabled', 'disabled');
                    $('#EditBtnProgramPrgElm').attr('disabled', 'disabled');
                    $('#downloadBtnProgramPrgElm').attr('disabled', 'disabled');   //Manasi


                    //Load Document Grid
                    var gridUploadedDocument = $('#gridUploadedDocumentProgramNewPrgElm tbody');
                    gridUploadedDocument.empty();
                    _Document.getDocumentByProjID().get({ DocumentSet: 'Project', ProjectID: _selectedProjectID }, function (response) {
                        wbsTree.setDocumentList(response.result);
                        for (var x = 0; x < _documentList.length; x++) {
                            //==================== Jignesh-11-03-2021 ===========================================================
                            if (!_documentList[x].TrendNumber) {
                                gridUploadedDocument.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                    '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesPrgElm" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' + //jignesh2111
                                    '</td > <td ' +
                                    'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                    '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                    '>' + _documentList[x].DocumentTypeName + '</td>' +
                                    '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                    '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                    '<tr > ');
                            }
                            //===================================================================================================
                        }

                        var deleteDocBtn = modal.find('.modal-body #delete-doc');
                        deleteDocBtn.attr('disabled', _documentList.length > 0 ? false : true);


                        $('input[name=rbCategoriesPrgElm]').on('click', function (event) {
                            // Pritesh for Authorization added on 5th Aug 2020
                            if (wbsTree.getLocalStorage().acl[4] == 1 && wbsTree.getLocalStorage().acl[5] == 0) {
                                $('#ViewUploadFileProgramPrgElm').removeAttr('disabled');
                                $('#EditBtnProgramPrgElm').removeAttr('disabled');
                                $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled'); //swapnil doc management
                            }
                            else {
                                $('#DeleteUploadProgramPrgElm').removeAttr('disabled');
                                $('#ViewUploadFileProgramPrgElm').removeAttr('disabled');
                                $('#EditBtnProgramPrgElm').removeAttr('disabled');
                                $('#downloadBtnProgramPrgElm').removeAttr('disabled');
                                $('#downloadBtnInViewAllProgramElement').removeAttr('disabled'); //swapnil doc management
                                $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled'); //swapnil doc management
                            }
                            localStorage.selectedElementDocument = $(this).closest("tr").find(".docId").text();

                        });
                    });

                    //---------------- Swapnil document management 29-01-2021-------------------

                    var gridViewAllUploadedDocumentProgramElement = $('#gridViewAllDocumentInProgramElement'); // Jignesh-SearchField-05022021
                    gridViewAllUploadedDocumentProgramElement.empty();

                    $('#downloadBtnInViewAllProgramElement').attr('disabled', 'disabled');
                    $('#ViewUploadFileInViewAllProgramElement').attr('disabled', 'disabled');

                    _Document.getDocumentByProjID().get({ DocumentSet: 'ProjectElementViewAll', ProjectID: _selectedProjectID }, function (response) {
                        wbsTree.setDocumentList(response.result);
                        for (var x = 0; x < _documentList.length; x++) {

                            // Edited by Jignesh (29-10-2020)
                            gridViewAllUploadedDocumentProgramElement.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
                                // '<input type="radio" group="prgrb" name="record">' +
                                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategoriesPrgElm" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' + //jignesh2111
                                '</td > <td ' +
                                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].TrendName + '</td>' +
                                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
                                '>' + _documentList[x].DocumentTypeName + '</td>' +
                                '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
                                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
                                '<tr > ');


                        }

                        $('input[name=rbCategoriesPrgElm]').on('click', function (event) {
                            // Pritesh for Authorization added on 5th Aug 2020
                            if (wbsTree.getLocalStorage().acl[4] == 1 && wbsTree.getLocalStorage().acl[5] == 0) {

                                $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled'); //swapnil doc management
                            }
                            else {

                                $('#downloadBtnInViewAllProgramElement').removeAttr('disabled'); //swapnil doc management
                                $('#ViewUploadFileInViewAllProgramElement').removeAttr('disabled'); //swapnil doc management
                            }

                        });
                        //============================ Jignesh-SearchField-05022021 ================================
                        var $rows = $('#gridViewAllDocumentInProgramElement tr');
                        $('#searchElem').keyup(function () { // Jignesh-08-02-2021
                            var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

                            $rows.show().filter(function () {
                                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                                return !~text.indexOf(val);
                            }).hide();
                        });
                        //==========================================================================================
                    });


                    //--------------------------------------------------------------------------

                    //Populate employees for dropdown
                    //Find the employee name given the id
                    //------------------------------ Swapnil changes 31-08-2020 --------------------------------------------

                    var projectManagerDropDown = modal.find('.modal-body #project_element_project_manager_id');
                    var directorDropDown = modal.find('.modal-body #project_element_director_id');
                    var schedulerDropDown = modal.find('.modal-body #project_element_scheduler_id');
                    var vicePresidentDropDown = modal.find('.modal-body #project_element_vice_president_id');
                    var financialAnalystDropDown = modal.find('.modal-body #project_element_financial_analyst_id');
                    var capitalProjectAssistantDropDown = modal.find('.modal-body #project_element_capital_project_assistant_id');

                    //-------------------------------------------------------------------------------------------------------
                    var laborRateDropdown = modal.find('.modal-body #labor_rate_id');

                    laborRateDropdown.empty();
                    //Append Labor Rate Type
                    laborRateDropdown.append('<option selected="false">' + "Billable Rate" + "</option>");
                    laborRateDropdown.append('<option selected="fasle">' + "Raw Rate with Multiplier" + "</option>");

                    var lobDropdown = modal.find('.modal-body #project_lob');
                    lobDropdown.empty();
                    lobList = wbsTree.getLineOfBusinessList();
                    for (var x = 0; x < lobList.length; x++) {
                        lobDropdown.append('<option selected="false">' + lobList[x].LOBName + "</option>");
                        lobDropdown.val("");
                    }

                    for (var x = 0; x < lobList.length; x++) {
                        if (lobList[x].ID == selectedNode.LineOfBusinessID) {
                            lobDropdown.val(lobList[x].LOBName);
                            lobDropdown.attr('disabled', true);
                        }
                    }



                    //-------------------------Swapnil 27-10-2020-------------------------------------------------------------
                    var projEleApproverDetails = null;
                  
                        angularHttp.get(serviceBasePath + 'Request/Project/null/null/' + selectedNode.ProjectID).then(function (response) {

                            const processApprovalMatirx = async () => {
                                const result = await getApprovalMatrix();
                                console.log(result);
                                projEleApproverDetails = response.data.result[0].ApproversDetails;
                                console.log("asf");
                                selectedNode.ProjectElementNumber = response.data.result[0].ProjectElementNumber;

                                modal.find('.modal-body #project_element_number').val(selectedNode.ProjectElementNumber);

                                var employeeList = wbsTree.getEmployeeList();
                                var userList = wbsTree.getUserList();
                                var newEmployeeList = [];

                                for (var x = 0; x < employeeList.length; x++) {
                                    if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                                        newEmployeeList.push(employeeList[x]);
                                        break;
                                    }
                                }

                                for (var x = 0; x < userList.length; x++) {
                                    for (var y = 0; y < employeeList.length; y++) {
                                        if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                                            newEmployeeList.push(employeeList[y]);
                                            break;
                                        }
                                    }
                                }
                                employeeList = newEmployeeList;
                                var approversDdl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers select');

                                for (var i = 0; i < approversDdl.length; i++) {
                                    var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                                    for (var j = 0; j < projEleApproverDetails.length; j++) {
                                        if (ApproverMatrixId == projEleApproverDetails[j].ApproverMatrixId) {

                                            $('#' + approversDdl[i].id).val(projEleApproverDetails[j].EmpId);
                                            break;
                                        }
                                    }
                                }
                            };

                            processApprovalMatirx();
                          

                           
                        });
                    
                    //--------------------------------------------------------------------------------------

                }
                else {
                    modal_mode = 'Create';
                    selectedNode.ProjectElementNumber = null;

                    g_newProject = true;
                    wbsTree.setIsProjectNew(true);
                    _Is_Project_New = true;
                    wbsTree.setProjectFileDraft([]);
                    $('#project_element_milestone_table_id').empty();
                    g_project_element_milestone_draft_list = [];


                    //luan Jquery - luan here
                    $('#project_element_class').prop('disabled', false);
                    $('#service_class').prop('disabled', false);
                    $("#element_start_date").datepicker();	//datepicker - project
                    $("#element_end_date").datepicker();	//datepicker - project
                    //$("#datepicker").val('2/2/2012');
                    console.log('applied jquery');

                    $('#documentUploadProgramNewPrgElm').attr('title', "A project element needs to be saved before the documents can be uploaded");  //Manasi 23-02-2021
                    $('#delete_project').attr('disabled', 'disabled');  //Manasi 24-02-2021
                    $('#spnBtndelete_project').attr('title', "A project element needs to be saved before it can be deleted");  //Manasi 24-02-2021
                    $('#updateBtnProgramPrgElm').attr('disabled', 'disabled');   //Manasi
                   // updateBtnProgramPrgElm
                    // For ProjectAccessControl
                    $('#emp_classDiv').hide(); // Multiselect

                    modal.find('.modal-title').text('New Project Element');
                    modal.find('.modal-body #project_name').val('');
                    modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
                    modal.find('.modal-body #project_element_name').val('');
                    modal.find('.modal-body #project_manager').val('');
                    modal.find('.modal-body #project_sponsor').val('');
                    modal.find('.modal-body #director').val('');
                    modal.find('.modal-body #scheduler').val('');
                    modal.find('.modal-body #exec_steering_comm').val('');
                    modal.find('.modal-body #vice_president').val('');
                    modal.find('.modal-body #financial_analyst').val('');
                    modal.find('.modal-body #capital_project_assistant').val('');
                    modal.find('.modal-body #cost_description').val('');
                    modal.find('.modal-body #schedule_description').val('');
                    modal.find('.modal-body #scope_quality_description').val('');
                    modal.find('.modal-body #labor_rate_id').val('');
                    modal.find('.modal-body #labor_rate').val('');
                    modal.find('.modal-body #project_lob').val('');
                    //luan here

                    // Pritesh Billing POC 

                    modal.find('.modal-body #program_billing_poc1').val('');
                    modal.find('.modal-body #program_billing_poc_phone_11').val('');
                    modal.find('.modal-body #program_billing_poc_phone_21').val('');
                    modal.find('.modal-body #program_billing_poc_email1').val('');

                    //===================== Jignesh-AddAddressField-21-01-2021 =================================
                    //modal.find('.modal-body #program_billing_poc_address1').val('');
                    modal.find('.modal-body #program1_billing_poc_address_line1').val('');
                    modal.find('.modal-body #program1_billing_poc_address_line2').val('');
                    modal.find('.modal-body #program1_billing_poc_city').val('');
                    modal.find('.modal-body #program1_billing_poc_state').val('');
                    modal.find('.modal-body #program1_billing_poc_po_num').val('');
                    //===========================================================================================
                    modal.find('.modal-body #program_billing_poc_special_instruction1').val('');

                    // Check
                    document.getElementById("program_tm_billing1").checked = false;
                    document.getElementById("program_sov_billing1").checked = false;
                    document.getElementById("program_monthly_billing1").checked = false;
                    document.getElementById("program_Lumpsum1").checked = false;
                    document.getElementById("program_certified_payroll1").checked = false;


                    //project element
                    modal.find('.modal-body #project_element_po_number').val('');
                    modal.find('.modal-body #project_element_number').val('');
                    modal.find('.modal-body #project_element_amount').val('');
                    modal.find('.modal-body #project_element_quickbookJobNumber').val('');
                    modal.find('.modal-body #project_element_locationName').val('');
                    modal.find('.modal-body #project_element_location').val('');
                    modal.find('.modal-body #project_element_description').val('');

                    modal.find('.modal-body #contract_number').val('');
                    modal.find('.modal-body #client').val('');
                    modal.find('.modal-body #project_element_class').val('');
                    modal.find('.modal-body #service_class').val('');
                    modal.find('.modal-body #element_start_date').val('');  //datepicker - project
                    modal.find('.modal-body #element_end_date').val('');	//datepicker - project

                    //populate docTypeList
                    var docTypeDropDownProject = modal.find('.modal-body #document_type_project');
                    var docTypeList = wbsTree.getDocTypeList();
                    docTypeDropDownProject.empty();

                    for (var x = 0; x < docTypeList.length; x++) {
                        docTypeDropDownProject.append('<option value="' + docTypeList[x].DocumentTypeID + '"> ' + docTypeList[x].DocumentTypeName + '</option>');
                    }

                    docTypeDropDownProject.val('');

                    //luan here
                    //Popoulate project types for dropdown
                    var projectTypeDropDown = modal.find('.modal-body #project_type');
                    var projectTypeList = wbsTree.getProjectTypeList();
                    projectTypeDropDown.empty();

                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == null) {
                            continue;
                        }
                        projectTypeDropDown.append('<option selected="false">' + projectTypeList[x].ProjectTypeName + '</option>');
                        projectTypeDropDown.val('');
                    }

                    //Populate project classes for dropdown
                    //Find the project class name given the id
                    if (wbsTree.getSelectedOrganizationID() == null) {
                        wbsTree.setSelectedOrganizationID($("#selectOrg").val());
                    }
                    console.log(wbsTree.getSelectedOrganizationID(), wbsTree.getSelectedProgramID());
                    var projectClassIDFromProgram = null;
                    wbsTree.getProgram().lookup().get({ OrganizationID: wbsTree.getSelectedOrganizationID(), ProgramID: wbsTree.getSelectedProgramID(), ProgramID: wbsTree.getSelectedProgramID() }, function (response) {
                        console.log(response);
                        projectClassIDFromProgram = response.result[0].ProjectClassID;

                        //selectedNode.ProjectClassID = projectClassIDFromProgram;    // Jignesh 24-11-2020
                        var projectClassDropDown = modal.find('.modal-body #project_element_class');
                        var projectClassList = wbsTree.getProjectClassList();
                        var projectClassName = '';
                        projectClassDropDown.empty();

                        for (var x = 0; x < projectClassList.length; x++) {
                            if (projectClassList[x].ProjectClassID == selectedNode.ProjectClassID) {
                                projectClassName = projectClassList[x].ProjectClassName
                            }

                            if (projectClassList[x].ProjectClassName == null) {
                                continue;
                            }
                            projectClassDropDown.append('<option selected="false">' + projectClassList[x].ProjectClassName + '</option>');
                        }
                        projectClassDropDown.val(projectClassName);
                        //projectClassDropDown.attr('disabled', false);
                    });

                    //added by vaishnavi
                    //wbsTree.getProgram().lookup().get({ OrganizationID: wbsTree.getSelectedOrganizationID(), ProgramID: wbsTree.getSelectedProgramID(), ProgramID: wbsTree.getSelectedProgramID() }, function (response) {
                    //    console.log(response);
                    //    serviceClassIDFromProgram = response.result[0].ProjectClassID;

                    //    //selectedNode.ProjectClassID = projectClassIDFromProgram;    // Jignesh 24-11-2020
                        var serviceClassDropDown = modal.find('.modal-body #service_class');
                        var serviceClassList = wbsTree.getServiceClassList();
                         var serviceClassName = '';
                        serviceClassDropDown.empty();

                        for (var x = 0; x < serviceClassList.length; x++) {
                            if (serviceClassList[x].ID == selectedNode.ProjectClassID) {
                                serviceClassName = serviceClassList[x].Description
                            }

                            if (serviceClassList[x].Description == null) {
                                continue;
                            }
                            serviceClassDropDown.append('<option selected="false">' + serviceClassList[x].Description + '</option>');
                        }
                             serviceClassDropDown.val(serviceClassName);


                    //    //projectClassDropDown.attr('disabled', false);
                    //});


                    //Populate project client for dropdown
                    var clientDropDown = modal.find('.modal-body #client');
                    var clientList = wbsTree.getClientList();
                    clientDropDown.empty();

                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientName == null) {
                            continue;
                        }
                        clientDropDown.append('<option selected="false">' + clientList[x].ClientName + '</option>');
                        clientDropDown.val('');
                    }

                    //Populate project location for dropdown
                    var locationDropDown = modal.find('.modal-body #project_element_location');
                    var locationList = wbsTree.getLocationList();
                    locationDropDown.empty();

                    for (var x = 0; x < locationList.length; x++) {
                        if (locationList[x].LocationName == null) {
                            continue;
                        }
                        locationDropDown.append('<option selected="false">' + locationList[x].LocationName + '</option>');
                        locationDropDown.val('');
                    }

                    //-------------------------------------------------------------------------------------------------------
                    var laborRateDropdown = modal.find('.modal-body #labor_rate_id');

                    laborRateDropdown.empty();
                    //Append Labor Rate Type
                    laborRateDropdown.append('<option selected="false">' + "Billable Rate" + "</option>");
                    laborRateDropdown.append('<option selected="fasle">' + "Raw Rate with Multiplier" + "</option>");
                    laborRateDropdown.val('Billable Rate');
                    laborRateDropdown.attr('disabled', false);

                    //lob
                    lobList = wbsTree.getLineOfBusinessList();
                    console.log(lobList);
                    var lobDropdown = modal.find('.modal-body #project_lob');
                    lobDropdown.empty();
                    //console.log(lobDropdown);
                    //lobDropdown.append('<option selected="false">TEST</option>')
                    for (var x = 0; x < lobList.length; x++) {
                        lobDropdown.append('<option selected="false">' + lobList[x].LOBName + '</option>');

                    }
                    lobDropdown.val('');
                    lobDropdown.attr('disabled', false);


                    //-------------------------Swapnil 27-10-2020-------------------------------------------------------------

                    var projApproverDetails = null;
                    angularHttp.get(serviceBasePath + 'Request/ProgramElement/null/' + selectedNode.ProgramElementID).then(function (response) {

                        projApproverDetails = response.data.result[0].ApproversDetails;

                        var employeeList = wbsTree.getEmployeeList();
                        var userList = wbsTree.getUserList();
                        var newEmployeeList = [];

                        for (var x = 0; x < employeeList.length; x++) {
                            if (employeeList[x].ID == 10000 || employeeList[x].Name == 'TBD') {
                                newEmployeeList.push(employeeList[x]);
                                break;
                            }
                        }

                        for (var x = 0; x < userList.length; x++) {
                            for (var y = 0; y < employeeList.length; y++) {
                                if (userList[x].EmployeeID == employeeList[y].ID && (employeeList[y].ID != 10000 && employeeList[y].Name != 'TBD')) {
                                    newEmployeeList.push(employeeList[y]);
                                    break;
                                }
                            }
                        }
                        employeeList = newEmployeeList;
                        var approversDdl = $('#ProjectModal').find('.modal-body #divProjectElememtApprovers select');

                        for (var i = 0; i < approversDdl.length; i++) {
                            $('#' + approversDdl[i].id).val('');
                            var ApproverMatrixId = $('#' + approversDdl[i].id).attr('dbid');
                            for (var j = 0; j < projApproverDetails.length; j++) {
                                if (ApproverMatrixId == projApproverDetails[j].ApproverMatrixId) {
                                    $('#' + approversDdl[i].id).val('');
                                    $('#' + approversDdl[i].id).val(projApproverDetails[j].EmpId);
                                    break;
                                }
                            }
                        }
                    });
                    //--------------------------------------------------------------------------------------



                    //No upload before project is saved.
                    var uploadBtnProject = modal.find('.modal-body #uploadBtnProject');
                    //uploadBtnProject.attr('disabled', true);

                    var gridUploadedDocument = $('#gridUploadedDocumentProgramNewPrgElm tbody');
                    gridUploadedDocument.empty();
                }

                var locationLatLong = null;
                if (selectedNode.level == "Project") {
                    if (selectedNode != null && selectedNode.LatLong != null && selectedNode.LatLong != "") {
                        locationLatLong = selectedNode.LatLong;
                    }
                }

                // Pritesh for Authorization added on 5th Aug 2020
                if (wbsTree.getLocalStorage().acl[4] == 1 && wbsTree.getLocalStorage().acl[5] == 0) {
                    $("#delete_project").attr('disabled', 'disabled');
                    $("#update_project").attr('disabled', 'disabled');
                    // $('#ProjectModal :input').attr('disabled', 'disabled');
                    $('#updateBtnProgramPrgElm').attr('disabled', 'disabled');

                    $('#cancel_project').removeAttr('disabled');
                    $('#cancel_project_x').removeAttr('disabled');
                } else {
                    //$("#delete_project").removeAttr('disabled'); //Manasi 24-02-2021
                    $("#update_project").removeAttr('disabled');
                    $('#updateBtnProgramPrgElm').attr('disabled', 'disabled');

                    if (selectedNode.level == "Project") {
                        // Edit
                        $('#updateBtnProgramPrgElm').removeAttr('disabled');
                    } else {
                        $('#updateBtnProgramPrgElm').attr('disabled', 'disabled');
                    }
                }
                var projectEditMap = new ProjectMap();

                window.setTimeout(function () { projectEditMap.initProjectEditMap(locationLatLong, wbsTree.getOrganizationList()); }, 250);
            });



            $('#ProjectModal').on('shown.bs.modal', function () {
                $('[id$=project_name]').focus();
                originalInfo = wbsTree.getSelectedNode();
            });

            $('#ProjectModal').on('hide.bs.modal', function (event) {
                modal = $(this);
                var angularHttp = wbsTree.getAngularHttp();
                selectedNode = wbsTree.getSelectedNode();
                CloseProjectModal(selectedNode, modal);

            });







            function appendFundAndReturnTotal(selectedNode, fundTable) {
                var total = 0;
                var filter = wbsTree.getFilter();
                angular.forEach(selectedNode.programFunds, function (item) {
                    console.log(item);
                    fundTable.append($('<tr class="clickrow">')
                        .append(
                            $('<td  class="deleteRow"  style="width:10%;">').append($('<span class="fa fa-trash"   style="width:100%">')),
                            $('<td class="fundTitle" style="width:18%;">').append($('<label>').text(item.FundName)),
                            $('<td class="fundAvailable" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(item.FundAmount, '$', 0))),

                            $('<td class="fundRequest" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(item.FundRequest, '$', 0))),
                            $('<td class="fundUsed" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(item.FundUsed, '$', 0))),
                            $('<td class="fundRemaining" style="width:18%;text-align:right;">').append($('<label>').text(filter('currency')(item.FundRemaining, '$', 0)))
                        )
                    );

                });
                $(".fundRemaining").each(function () {
                    var value = $(this).text();
                    total += parseFloat(value.replace(/[^0-9\.]+/g, ""));
                });
                return total;
            }
            function appendCategory(selectedNode, categoryTable) {
                var total = 0;
                var filter = wbsTree.getFilter();
                angular.forEach(selectedNode.programCategories, function (item) {
                    console.log(item);
                    categoryTable.append($('<tr class="clickrow">')
                        .append(
                            $('<td  class="deleteCategoryRow"  style="width:10%;cursor:pointer;">').append($('<span class="fa fa-trash"   style="width:100%">')),
                            $('<td class="mainCat" style="width:40%;">').append($('<label>').text(item.ActivityCategory.CategoryDescription)),
                            $('<td class="subCat" style="width:40%;">').append($('<label>').text(item.ActivityCategory.SubCategoryDescription)),
                            $('<td class="phaseCode" style="width:10%;">').append($('<label>').text(item.ActivityCategory.Phase))

                        )
                    );

                });
            }
            function appendScopeTable(selectedNode, scopeTable) {
                console.log(selectedNode);
                var descriptionList = wbsTree.getDescriptionList();
                descriptionList = [];
                angular.forEach(selectedNode.projectScopes, function (item) {
                    console.debug("ITEM", item);
                    descriptionList.push(item.Description);
                    scopeTable.append($('<tr class="clickRowScope">')
                        .append(
                            $('<td  id="infoRow"  style="width:5%;">').append($('<span class="fa fa-info-circle"   style="width:100%;color:black !important; font-size:20px;">')),
                            $('<td scope="col" style="text-align:center;position: relative; width: 30%; vertical-align: middle">').
                                append($('<div class="dropdown">').
                                    append(
                                        $(' <a style="color :#337ab7 !important; " tabindex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">').
                                            append(
                                                $(' <label id="dropLabel" style="margin-right:5px;"></label>').text(item.Area),
                                                $('<span class="caret"></span>')
                                            ),
                                        $('<ul class="dropdown-menu" id="hello">').append(
                                            //$('<li>').append('<a tabindex="0" >Facility</a>'),
                                            $('<li class="dropdown-submenu">').append(
                                                $('<a tabindex="0">Facilities</a>'),
                                                $('<ul class="dropdown-menu">').append(
                                                    $('<li>').append('<a tabindex="0">Los Angeles Center</a>'),
                                                    $('<li>').append('<a tabindex="0">Salt Lake City Center</a>'),
                                                    $('<li>').append('<a tabindex="0">Oakland Center</a>'),
                                                    $('<li>').append('<a tabindex="0">Fort Worth Center</a>'),
                                                    $('<li>').append('<a tabindex="0">Atlanta Center</a>'),
                                                    $('<li>').append('<a tabindex="0">Washington Center </a>')
                                                )
                                            ),
                                            $('<li class="dropdown-submenu">').append(
                                                $('<a tabindex="0">System </a>'),
                                                $('<ul class="dropdown-menu">').append(
                                                    $('<li>').append('<a tabindex="0">Network</a>'),
                                                    $('<li>').append('<a tabindex="0">Operating System</a>'),
                                                    $('<li>').append('<a tabindex="0">Database</a>'),
                                                    $('<li>').append('<a tabindex="0">Application</a>'),
                                                    $('<li>').append('<a tabindex="0">Host</a>'),
                                                    $('<li>').append('<a tabindex="0"> End Devices </a>')
                                                )
                                            ),
                                            $('<li>').append('<a tabindex="0";>Infrastructure</a>'),
                                            $('<li>').append('<a tabindex="0">Opeartion</a>')
                                        )

                                    )
                                ),
                            $('<td scope="col" style="text-align:center;position: relative; width: 30%; vertical-align: middle">').
                                append($('<div class="dropdown" >').
                                    append(
                                        $(' <a style="color :#337ab7 !important; " tabindex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">').
                                            append(
                                                $(' <label id="assetLabel" style="margin-right:5px;"></label>').text((item.Asset) ? item.Asset : "Select Asset"),
                                                $('<span class="caret"></span>')
                                            ),
                                        $('<ul class="dropdown-menu" id="asset" style="height:250px;overflow-y:scroll">').append(

                                        )

                                    )
                                ),
                            $('<td scope="col" style="text-align:center;position: relative; width: 30%; vertical-align: middle">').
                                append($('<div class="dropdown">').
                                    append(
                                        $(' <a style="color :#337ab7 !important; " tabindex="0" data-toggle="dropdown" data-submenu="" aria-expanded="false">').
                                            append(
                                                $(' <label id="impactLabel" style="margin-right:5px;"></label>').text((item.ImpactType) ? item.ImpactType : "Select Impact"),
                                                $('<span class="caret"></span>')
                                            ),
                                        $('<ul class="dropdown-menu" id="impact">').append(
                                            //$('<li>').append('<a tabindex="0" >Facility</a>'),
                                            $('<li>').append('<a tabindex="0";>New</a>'),
                                            $('<li>').append('<a tabindex="0";>Replacement</a>'),
                                            $('<li>').append('<a tabindex="0">Moveout Changes</a>')

                                        )

                                    )
                                ),
                            $('<td  class="deleteRow"  style="width:5%;">').append($('<span class="fa fa-trash"   style="width:100%">')),
                            $('<td scope="col" style="display:none">false</td>'),
                            $('<td scope="col" style="display:none"></td>').text(item.Id)
                        )
                    );


                    $('[data-submenu]').submenupicker();
                });
                var rows = scopeTable.find('tr');
                $.each(rows, function () {
                    var rowData = $(this).find('td');

                    var first = $(rowData[1]).find('#dropLabel');

                    var second = $(rowData[2]).find("#asset");
                    switch ($(first).text().trim()) {
                        case "Network":
                            networkList(second);
                            break;
                        case "Operating System":
                            databaseList(second);
                            break;
                        case "Database":
                            databaseList(second);
                            break;
                        case "Application":
                            applicationList(second);
                            break;
                        case "Host":
                            hostList(second);
                            break;
                        case "End Devices":
                            endDeviceList(second);
                            break;
                        case "Select Layer":
                            break;
                        default: networkList(second);

                    }
                })

                wbsTree.setDescriptionList(descriptionList);
            }

            //Make modal draggble
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });

            function defaultModalPosition() {
                $('.modal-dialog').css('top', '');
                $('.modal-dialog').css('left', '');
            }
            function EnableDeleteView() {
                alert("sdssd");
            }



            // Exit Confirmation Buttons
            $('#ec-exit').unbind('click').on('click', function () {
                $("#ExitConfirmModal").hide();
                var t = "#" + getCorrectLevel() + "Modal";
                $(t).css({ "opacity": "1" }).modal('toggle');
            });
            $('#ec-save').unbind('click').on('click', function () {
                $("#ExitConfirmModal").hide();
                console.log(getCorrectLevel());
                if (getCorrectLevel() === "Program") {
                    $("#update_program").click();
                } else if (getCorrectLevel() === "ProgramElement") {
                    //alert("save program element");
                    $("#update_program_element").click();
                } else if (getCorrectLevel() === "Project") {
                    //alert("save project");
                    $("#update_project").click();
                }
                var t = "#" + getCorrectLevel() + "Modal";
                $(t).css({ "opacity": "1" }).modal('toggle');
            });
            $('#ec-cancel').unbind('click').on('click', function () {
                $("#ExitConfirmModal").hide();
                var t = "#" + getCorrectLevel() + "Modal";
                $(t).css({ "opacity": "1" });
            });

        }

        var getCorrectLevel = function () {
            var i = wbsTree.getSelectedNode().level;
            if (modal_mode === "Create") {
                if (i === "Root") {
                    i = "Program";
                }
                else if (i === "Program") {
                    i = "ProgramElement";
                }
                else if (i === "ProgramElement") {
                    i = "Project";
                }
                // add one for trends if needed
            }
            return i;
        }

        // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children
        var centerNode = function (source, zoomListener) {

            var scale = zoomListener.scale();
            var x = -source.y0;
            var y = -source.x0;
            x = x * scale + viewerWidth / 2 - 100;
            y = y * scale + viewerHeight / 4 - 150;
            d3.select('g').transition()
                .duration(_duration)
                .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
            zoomListener.scale(scale);
            zoomListener.translate([x, y]);
        }

        // Toggle children function
        var toggleChildren = function (d) {

            if (d.children) {
                d._children = d.children;
                d.children = null;
            }
            else {
                d.children = d._children;
                d._children = null;
            }


            return d;
        }

        obj.prototype.showContextMenu = function (node, type) {

            console.log(node.y0 + "," + node.x0);

            console.log(wbsTree.getLocalStorage().role);

            var svg_graph = d3.select("#tree-container").select("svg > g");
            var svg_rect = svg_graph[0][0].getBBox();
            var zoom = d3.behavior.zoom();
            var g_scale = zoom.scale();

            var xOffset = svg_rect.x;
            var yOffset = svg_rect.y;


            var pageY = node.x0 + 200 - (yOffset * g_scale * 2);
            var pageX = node.y0 - 50 - (xOffset * g_scale * 2);
            $("#contextMenu").attr('contextType', type);

            var contextMenuAddText;
            var contextMenuEditText;

            $("#contextMenuAdd").parent().hide();
            $("#contextMenuEdit").parent().hide();
            $("#contextMenuDelete").parent().hide();
            // Pritesh change all acl index on 4th to 5th Aug as it was not properly  mapped with DB record
            if (type == "Root") {
                if (wbsTree.getLocalStorage().acl[1] == 1) {
                    contextMenuAddText = "Add Contract";
                    contextMenuEditText = "Edit/Open Organization";

                    $("#contextMenuEdit").parent().hide();
                    $("#contextMenuAdd").parent().show();
                }
            }
            else if (type == "Program") {
                if (wbsTree.getLocalStorage().acl[3] == 1) {
                    contextMenuAddText = "Add Project";
                    $("#contextMenuAdd").parent().show();
                }
                if (wbsTree.getLocalStorage().acl[0] == 1) {
                    contextMenuEditText = "Open Contract";
                    $("#contextMenuEdit").parent().show();

                }
                if (wbsTree.getLocalStorage().acl[1] == 1) {
                    contextMenuEditText = "Edit/Open Contract";
                    $("#contextMenuEdit").parent().show();
                    $("#contextMenuDelete").parent().show();
                }
            }
            else if (type == "ProgramElement") {
                if (wbsTree.getLocalStorage().acl[5] == 1) {
                    contextMenuAddText = "Add Element";
                    $("#contextMenuAdd").parent().show();
                }
                if (wbsTree.getLocalStorage().acl[2] == 1) {
                    contextMenuEditText = "Open Project";
                    $("#contextMenuEdit").parent().show();

                }
                if (wbsTree.getLocalStorage().acl[3] == 1) {
                    contextMenuEditText = "Edit/Open Project";
                    $("#contextMenuEdit").parent().show();
                    $("#contextMenuDelete").parent().show();
                }
            }
            else if (type == "Project") {
                if (wbsTree.getLocalStorage().acl[7] == 1) {
                    contextMenuAddText = "Add Trend";
                    $("#contextMenuAdd").parent().show();
                }
                if (wbsTree.getLocalStorage().acl[4] == 1) {
                    contextMenuEditText = "Open Element";
                    $("#contextMenuEdit").parent().show();

                }
                if (wbsTree.getLocalStorage().acl[5] == 1) {
                    contextMenuEditText = "Edit/Open Element";
                    $("#contextMenuEdit").parent().show();
                    $("#contextMenuDelete").parent().show();
                }
            }
            //else {
            //    contextMenuAddText = "Add New";
            //    contextMenuEditText = "Edit/Open";
            //}

            if (contextMenuAddText) $("#contextMenuAdd").html(contextMenuAddText);
            if (contextMenuEditText) $("#contextMenuEdit").html(contextMenuEditText);


            if (type == "Root") {
                //$("#contextMenuAdd").parent().show();

                $("#contextMenuDelete").parent().hide();
                $("#contextMenuScope").parent().hide();
                $("#contextMenuMap").parent().show();
                //$("#contextMenuProjectScope").parent().hide();
            } else {
                //$("#contextMenuAdd").parent().show();

                if (type == "Project") {
                    $("#contextMenuScope").parent().show();
                    //$("#contextMenuProjectScope").parent().hide();
                }
                else
                    $("#contextMenuScope").parent().hide();
                //$("#contextMenuEdit").parent().show();
                //$("#contextMenuDelete").parent().show();
                $("#contextMenuMap").parent().hide();
            }
            console.log(pageX);
            console.log(pageY);
            $("#contextMenu").css({
                display: "block",
                left: pageX,
                top: (pageY - scrollOffset)
            }).css({
                'margin-left': '-2em',
                'margin-top': '-5em'
            });

        }

        var addCommas = function (nStr) {
            var num = Number(nStr);
            if (num > 1000000) {
                //var rndNum = Math.ceil(num/1000000)*1000000;
                var rndNum = Math.round(num / 100000);
                rndNum = rndNum / 10;
                nStr = rndNum + "M";
            } else if (rndNum > 1000) {
                var rndNum = Math.round(num / 100);
                rndNum = rndNum / 10;
                nStr = rndNum + "K";
            }

            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

        var getSelectedFund = function () {
            var row = $(this).closest('tr');
            var rowData = row.find('td');
            var rowFundName = rowData[1].textContent;
            var rowFundAmount = rowData[2].textContent;
            angular.forEach(fundList, function (item) {
                if (item.Fund == rowFundName) {
                    $('#fundSelect').val(item.FundTypeId);
                    modal.find('.modal-body #availableFund').val(item.BalanceRemaining);
                    modal.find('.modal-body #assignFund').val(rowFundAmount);
                }
            })
        }

        var getTodayAsString = function () {

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd
            }
            if (mm < 10) {
                mm = '0' + mm
            }
            var todayAsStr = yyyy + '-' + mm + '-' + dd;
            return todayAsStr;
        }

        //debugging function
        obj.prototype.example = function () {
        }

        //used for exit confirmation
        obj.prototype.unsavedChanges = function (level) {
            //return true if unsaved changes else false
            console.log(level + " -- Checking for unsaved changes");
            return false;
            if (level == "Program") {
                var newFunds = wbsTree.getFundToBeAdded();
                var stop = null;

                //handle new node
                if (modal_mode === "Create") {
                    return (!((modal.find('.modal-body #program_name').val() == undefined || modal.find('.modal-body #program_name').val() == "")
                        && (modal.find('.modal-body #program_manager').val() == undefined || modal.find('.modal-body #program_manager').val() == "")
                        && (modal.find('.modal-body #program_sponsor').val() == undefined || modal.find('.modal-body #program_sponsor').val() == "")
                    ));
                } else {
                    var programName = modal.find('.modal-body #program_name').val();
                    var programManagerName = modal.find('.modal-body #program_manager_id').val();
                    var programSponsorName = modal.find('.modal-body #program_sponsor_id').val();

                    var programManager = originalInfo.ProgramManager;
                    var programSponsor = originalInfo.ProgramSponsor;

                    var employeeList = wbsTree.getEmployeeList();
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == programManagerName) {  //Program Manager
                            programManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == programSponsorName) {  //Program Sponsor
                            programSponsorID = employeeList[x].ID;
                        }
                    }
                    return (!(originalInfo.name == programName
                        && originalInfo.ProgramManager === programManager
                        && originalInfo.ProgramSponsor === programSponsor));
                }

                ////check if any changes in funds
                //if(originalFund.length != newFunds.length){
                //    //if not equal lengths, something was added or deleted
                //    console.log("not equal lengths");
                //    return true;
                //} else {
                //    //if equal lengths, check to make sure info has not changed
                //    console.log("checking all funds");
                //    $.each(originalFund,function(key,value){
                //        //console.log("checking item " + (++counter));
                //        if(value.FundAmount != newFunds[key].FundAmount
                //            || value.FundName != newFunds[key].FundName
                //            || value.FundRemaining != newFunds[key].FundRemaining
                //            || value.FundRequest != newFunds[key].FundRequest
                //            || value.FundUsed != newFunds[key].FundUsed){
                //            //if find one that is not equal, exit loop
                //            stop = true;
                //            if(stop){ return false; } //exits loop
                //        }
                //    })
                //}
                ////if exited loop, return true - there are unsaved changes
                //if(stop){ return true; }

                //check changes in name, manager, or sponsor

            }
            else if (level == "Project") {
                console.log(modal_mode);
                if (modal_mode === "Create") {
                    var changedLaborRate = false;

                    if (modal.find('.modal-body #labor_rate_id').val() != 'Billable Rate') {
                        changedLaborRate = true;
                    }


                    return (!(
                        modal.find('.modal-body #project_element_name').val() == undefined || modal.find('.modal-body #project_element_name').val() == ""
                        //&& (modal.find('.modal-body #labor_rate_id').val() == undefined || modal.find('.modal-body #labor_rate_id').val() == "")
                        && (modal.find('.modal-body #project_element_po_number').val() == undefined || modal.find('.modal-body #project_element_po_number').val() == "")
                        && (modal.find('.modal-body #project_element_amount').val() == undefined || modal.find('.modal-body #project_element_amount').val() == "")
                        && (modal.find('.modal-body #project_element_quickbookJobNumber').val() == undefined || modal.find('.modal-body #project_element_quickbookJobNumber').val() == "")
                        && (modal.find('.modal-body #project_element_locationName').val() == undefined || modal.find('.modal-body #project_element_locationName').val() == "")
                        && (modal.find('.modal-body #project_element_description').val() == undefined || modal.find('.modal-body #project_element_description').val() == "")
                    ) || changedLaborRate);
                } else {
                    console.log(originalInfo);
                    var programElementName = modal.find('.modal-body #project_element_name').val();
                    var clientPONumber = modal.find('.modal-body #project_element_po_number').val();
                    var projectElementAmount = modal.find('.modal-body #project_element_amount').val();
                    var quickbookJobNumber = modal.find('.modal-body #project_element_quickbookJobNumber').val();
                    var locationName = modal.find('.modal-body #project_element_locationName').val();
                    var projectElementDescription = modal.find('.modal-body #project_element_description').val();

                    console.log(programElementName, clientPONumber, projectElementAmount);

                    if (originalInfo.QuickbookJobNumber == null) originalInfo.QuickbookJobNumber = '';
                    if (originalInfo.LocationName == null) originalInfo.LocationName = '';


                    return (!(
                        originalInfo.ProjectName == programElementName
                        && originalInfo.ClientPONumber == clientPONumber
                        && originalInfo.Amount == projectElementAmount
                        && originalInfo.QuickbookJobNumber == quickbookJobNumber
                        && originalInfo.LocationName == locationName
                        && originalInfo.ProjectDescription == projectElementDescription
                    ));
                }
            }
            else if (level == "ProgramElement") {
                console.log(modal_mode);
                console.debug("CHECK", wbsTree.getProjectMap().getCoordinates());
                if (modal_mode === "Create") {
                    //console.log(wbsTree.getProjectMap().getCoordinates());
                    return (!((modal.find('.modal-body #project_name').val() == undefined || modal.find('.modal-body #project_name').val() == "")
                        && (modal.find('.modal-body #project_start_date').val() == undefined || modal.find('.modal-body #project_start_date').val() == "")    //datepicker - program element
                        && (modal.find('.modal-body #contract_start_date').val() == undefined || modal.find('.modal-body #contract_start_date').val() == "")   //datepicker - program element
                        //&& (modal.find('.modal-body #project_manager').val() == undefined || modal.find('.modal-body #project_manager').val() == "")
                        //&& (modal.find('.modal-body #project_sponsor').val() == undefined || modal.find('.modal-body #project_sponsor').val() == "")
                        //&& (modal.find('.modal-body #director').val() == undefined || modal.find('.modal-body #director').val() == "")
                        //&& (modal.find('.modal-body #scheduler').val() == undefined || modal.find('.modal-body #scheduler').val() == "")
                        //&& (modal.find('.modal-body #vice_president').val() == undefined || modal.find('.modal-body #vice_president').val() == "")
                        //&& (modal.find('.modal-body #financial_analyst').val() == undefined || modal.find('.modal-body #financial_analyst').val() == "")
                        //&& (modal.find('.modal-body #capital_project_assistant').val() == undefined || modal.find('.modal-body #capital_project_assistant').val() == "")
                        && (modal.find('.modal-body #contract_number').val() == undefined || modal.find('.modal-body #contract_number').val() == "")
                        && (modal.find('.modal-body #project_type').val() == undefined || modal.find('.modal-body #project_type').val() == "")
                        && (modal.find('.modal-body #client').val() == undefined || modal.find('.modal-body #client').val() == "")
                        && (modal.find('.modal-body #project_manager_id').val() == undefined || modal.find('.modal-body #project_manager_id').val() == "")
                        && (modal.find('.modal-body #director_id').val() == undefined || modal.find('.modal-body #director_id').val() == "")
                        && (modal.find('.modal-body #scheduler_id').val() == undefined || modal.find('.modal-body #scheduler_id').val() == "")
                        && (modal.find('.modal-body #vice_president_id').val() == undefined || modal.find('.modal-body #vice_president_id').val() == "")
                        && (modal.find('.modal-body #financial_analyst_id').val() == undefined || modal.find('.modal-body #financial_analyst_id').val() == "")
                        && (modal.find('.modal-body #capital_project_assistant_id').val() == undefined || modal.find('.modal-body #capital_project_assistant_id').val() == "")
                        && (modal.find('.modal-body #cost_description').val() == undefined || modal.find('.modal-body #cost_description').val() == "")
                        && (modal.find('.modal-body #schedule_description').val() == undefined || modal.find('.modal-body #schedule_description').val() == "")
                        && (modal.find('.modal-body #scope_quality_description').val() == undefined || modal.find('.modal-body #scope_quality_description').val() == "")
                        //&& (modal.find('.modal-body #labor_rate').val() == undefined || modal.find('.modal-body #labor_rate_id').val() == "")
                        //&& (modal.find('.modal-body #document_type').val() == undefined || modal.find('.modal-body #document_type').val() == "")
                        //&& wbsTree.getProjectMap().getCoordinates() == undefined  || wbsTree.getProjectMap().getCoordinates() == "" //no changes on map
                    ));
                } else {
                    //luan here - find the project type name given from current view
                    var projectTypeName = modal.find('.modal-body #project_type').val();
                    var projectTypeList = wbsTree.getProjectTypeList();
                    var projectTypeID = originalInfo.ProjectTypeID;
                    for (var x = 0; x < projectTypeList.length; x++) {
                        if (projectTypeList[x].ProjectTypeName == projectTypeName) {
                            projectTypeID = projectTypeList[x].ProjectTypeID
                        }
                    }

                    ////luan here - Find the project class name from current view
                    //var projectClassName = modal.find('.modal-body #project_class');

                    //luan here - Find the client name from current view
                    var clientName = modal.find('.modal-body #client').val();
                    var clientList = wbsTree.getClientList();
                    var clientID = originalInfo.ClientID;
                    for (var x = 0; x < clientList.length; x++) {
                        if (clientList[x].ClientName == clientName) {
                            clientID = clientList[x].ClientID;
                        }
                    }

                    //luan here - Find the location name from current view
                    var locationName = modal.find('.modal-body #location').val();
                    var locationList = wbsTree.getLocationList();
                    var locationID = originalInfo.LocationID;
                    for (var x = 0; x < locationList.length; x++) {
                        if (locationList[x].LocationName == locationName) {
                            locationID = locationList[x].LocationID;
                        }
                    }

                    //find the labor rate type
                    var laborRateType = modal.find('.modal-body #labor_rate_id').val();
                    var CostOverheadTypeID = originalInfo.CostOverheadTypeID;
                    for (var x = 0; x < costOverheadTypes.length; x++) {
                        if (costOverheadTypes[x].CostOverHeadType == laborRateType)
                            CostOverheadTypeID = costOverheadTypes[x].ID;
                    }
                    ////luan here - Find the doc type name from current view
                    //var documentTypeName = modal.find('.modal-body #document_type').val();
                    //var documentTypeList = wbsTree.getDocTypeList();
                    //var documentTypeID = originalInfo.DocumentTypeID;
                    //for (var x = 0; x < documentTypeList.length; x++) {
                    //    if (documentTypeList[x].DocumentTypeName == documentTypeName) {
                    //        documentTypeID = documentTypeList[x].DocumentTypeID;
                    //    }
                    //}

                    //luan here - Find the employee names from current view
                    var projectManagerName = modal.find('.modal-body #project_manager_id').val();
                    var directorName = modal.find('.modal-body #director_id').val();
                    var schedulerName = modal.find('.modal-body #scheduler_id').val();
                    var vicePresidentName = modal.find('.modal-body #vice_president_id').val();
                    var financialAnalystName = modal.find('.modal-body #financial_analyst_id').val();
                    var capitalProjectAssistantName = modal.find('.modal-body #capital_project_assistant_id').val();

                    var projectManagerID = originalInfo.ProjectManagerID;
                    var directorID = originalInfo.DirectorID;
                    var schedulerID = originalInfo.SchedulerID;
                    var vicePresidentID = originalInfo.VicePresidentID;
                    var financialAnalystID = originalInfo.FinancialAnalystID;
                    var capitalProjectAssistantID = originalInfo.CapitalProjectAssistantID;

                    var employeeList = wbsTree.getEmployeeList();
                    for (var x = 0; x < employeeList.length; x++) {
                        if (employeeList[x].Name == projectManagerName) {  //Project manager
                            projectManagerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == directorName) {  //Director
                            directorID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == schedulerName) {  //Scheduler
                            schedulerID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == vicePresidentName) {  //Vice president
                            vicePresidentID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == financialAnalystName) {  //Financial analyst
                            financialAnalystID = employeeList[x].ID;
                        }
                        if (employeeList[x].Name == capitalProjectAssistantName) {  //Capital project assistant
                            capitalProjectAssistantID = employeeList[x].ID;
                        }
                    }

                    console.log(originalInfo);

                    var projectName = modal.find('.modal-body #project_name').val();
                    var contractNumber = modal.find('.modal-body #contract_number').val();
                    var projectStartDate = modal.find('.modal-body #project_start_date').val() //datepicker;
                    var contractStartDate = modal.find('.modal-body #contract_start_date').val() //datepicker;
                    var costDescription = modal.find('.modal-body #cost_description').val();
                    var scheduleDescription = modal.find('.modal-body #schedule_description').val();
                    var scopeQualityDescription = modal.find('.modal-body #scope_quality_description').val();

                    if (originalInfo.CostDescription == null) originalInfo.CostDescription = '';
                    if (originalInfo.ScheduleDescription == null) originalInfo.ScheduleDescription = '';
                    if (originalInfo.ScopeQualityDescription == null) originalInfo.ScopeQualityDescription = '';

                    return (!(originalInfo.ProgramElementName == projectName
                        && originalInfo.ProjectTypeID === projectTypeID
                        && originalInfo.ContractNumber == contractNumber
                        && originalInfo.ProjectStartDate == projectStartDate
                        && originalInfo.ContractStartDate == contractStartDate
                        //&& originalInfo.CostOverheadTypeID == CostOverheadTypeID
                        && originalInfo.ClientID == clientID
                        && originalInfo.ProjectManagerID == projectManagerID
                        && originalInfo.DirectorID == directorID
                        && originalInfo.SchedulerID == schedulerID
                        && originalInfo.VicePresidentID == vicePresidentID
                        && originalInfo.FinancialAnalystID == financialAnalystID
                        && originalInfo.CapitalProjectAssistantID == capitalProjectAssistantID
                        && originalInfo.CostDescription == costDescription
                        && originalInfo.ScheduleDescription == scheduleDescription
                        && originalInfo.ScopeQualityDescription == scopeQualityDescription
                        //&& wbsTree.getProjectMap().getCoordinates() == "" //no changes on map
                    ));
                }
            }
            else {
                console.log("Uh Oh, something went wrong...");
                return true;
            }
        }
        //function bindContractDocument() {
        //    _Document.getDocumentByProjID().get({ DocumentSet: 'Program', ProjectID: _selectedProgramID }, function (response) {
        //        wbsTree.setDocumentList(response.result);
        //        var gridUploadedDocumentProgram = $("#gridUploadedDocumentProgramNew tbody")
        //        gridUploadedDocumentProgram.empty();
        //        for (var x = 0; x < _documentList.length; x++) {

        //            //====================================== Edited By Jignesh 28-10-2020 =======================================
        //            gridUploadedDocumentProgram.append('<tr id="' + _documentList[x].DocumentID + '"><td style="width: 20px">' +
        //                // '<input type="radio" group="prgrb" name="record">' +
        //                '<input id=rb' + _documentList[x].DocumentID + ' type="radio"  name="rbCategories" value="' + serviceBasePath + 'Request/DocumentByDocID/' + _documentList[x].DocumentID + '" />' +
        //                '</td > <td ' +
        //                'style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
        //                '><a>' + _documentList[x].DocumentName + '</a></td> ' +
        //                '<td style=" overflow: hidden; text-overflow: ellipsis; white-space: nowrap; "' +
        //                '>' + _documentList[x].DocumentTypeName + '</td>' +
        //                '<td><input type="button" name="btnViewDetail"  id="viewDocumentDetail" style="color:white;background-color: #0c50e8;" value="View"/></td>' +
        //                '<td class="docId" style="display:none;"><span>' + _documentList[x].DocumentID + '</span></td>' +
        //                '<tr > ');   //MM/DD/YYYY h:mm a'
        //        }

        //    });
        //}

        function networkList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),

            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function applicationList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),
                $('<li>').append('<a tabindex="0";>PP Web Application</a>'),
                $('<li>').append('<a tabindex="0";>Police CAD</a>'),
                $('<li>').append('<a tabindex="0">Credentialing System</a>'),
                $('<li>').append('<a tabindex="0">BFM</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Application</a>'),
                $('<li>').append('<a tabindex="0";>TSC Web Apps</a>'),
                $('<li>').append('<a tabindex="0">Fisc Web App</a>'),
                $('<li>').append('<a tabindex="0">Other</a>')
            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function endDeviceList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Micro Controller</a>'),
                $('<li>').append('<a tabindex="0";>PP Micro Controllers</a>'),
                $('<li>').append('<a tabindex="0">AMAG Devices</a>'),
                $('<li>').append('<a tabindex="0">Other Device</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Application</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Readers</a>'),
                $('<li>').append('<a tabindex="0">PP Readers</a>'),
                $('<li>').append('<a tabindex="0">CCTV Camera</a>'),
                $('<li>').append('<a tabindex="0";>CCTV Ancillary</a>'),
                $('<li>').append('<a tabindex="0";>Intercom Station</a>'),
                $('<li>').append('<a tabindex="0">Intrusion Panel Txion</a>'),
                $('<li>').append('<a tabindex="0">Serial Device</a>'),
                $('<li>').append('<a tabindex="0";>Building Control</a>'),
                $('<li>').append('<a tabindex="0";>DV Camera</a>'),
                $('<li>').append('<a tabindex="0">DVS</a>'),
                $('<li>').append('<a tabindex="0">Intrusion Panel</a>'),
                $('<li>').append('<a tabindex="0";>Intrusion Area</a>'),
                $('<li>').append('<a tabindex="0">Intrusion Zone</a>'),
                $('<li>').append('<a tabindex="0">Serial Device</a>'),
                $('<li>').append('<a tabindex="0";>Intrusion Detector</a>'),
                $('<li>').append('<a tabindex="0";>Intrusion Output</a>'),
                $('<li>').append('<a tabindex="0">PP Micro</a>'),
                $('<li>').append('<a tabindex="0">AMAG Micro Controllers</a>')
            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);

        }

        function databaseList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),
                $('<li>').append('<a tabindex="0";>PP Database Service</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Database Service</a>'),
                $('<li>').append('<a tabindex="0">PP Database</a>')

            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function hostList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),
                $('<li>').append('<a tabindex="0";>PP Client Machine</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Host</a>'),
                $('<li>').append('<a tabindex="0">AMAG Client Machine</a>'),
                $('<li>').append('<a tabindex="0";>TSC Host</a>'),
                $('<li>').append('<a tabindex="0";>FISC Host</a>')

            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function serverList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),
                $('<li>').append('<a tabindex="0";>AMAG Server</a>'),
                $('<li>').append('<a tabindex="0";>PP Servert</a>')
            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function operationalList(tableData) {
            $(tableData).empty().append(
                //$('<li>').append('<a tabindex="0" >Facility</a>'),
                $('<li>').append('<a tabindex="0";>PP DOOR ACCESS</a>'),
                $('<li>').append('<a tabindex="0";>AMAG_DOOR_ACCESS</a>'),
                $('<li>').append('<a tabindex="0">AMAG_READER</a>')


            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function infrastructureList(tableData) {
            $(tableData).empty().append(


            );
            var length = $(tableData).children().length;
            if (length > 7) {
                $(tableData).css("height", "250px");
            }
            else {
                $(tableData).css("height", ((36 * length) + 12).toString() + "px");
            }
            console.log($(tableData).children().length);
        }

        function CloseProjectModal(SelectedNode, Modal) {
            var selectedNode = SelectedNode;
            var modal = Modal;
            wbsTree.setSelectedNode(selectedNode);
            var fundTable = $("#fundTable").find('.fund ');
            modal.find('.modal-body #project_name').val(selectedNode.ProjectName);	//luan eats
            modal.find('.modal-body #project_manager').val(selectedNode.ProjectManager);
            modal.find('.modal-body #project_sponsor').val(selectedNode.ProjectSponsor);
            modal.find('.modal-body #director').val(selectedNode.Director);
            modal.find('.modal-body #scheduler').val(selectedNode.Scheduler);
            modal.find('.modal-body #exec_steering_comm').val(selectedNode.ExecSteeringComm);
            modal.find('.modal-body #vice_president').val(selectedNode.VicePresident);
            modal.find('.modal-body #financial_analyst').val(selectedNode.FinancialAnalyst);
            modal.find('.modal-body #capital_project_assistant').val(selectedNode.CapitalProjectAssistant);
            modal.find('.modal-body #availableFund').val('');
            modal.find('.modal-body #labor_rate_id').val('');
            modal.find('.modal-body #project_lob').val('');
            //luan here - code here does nothing?
            modal.find('.modal-body #project_number').val(selectedNode.ProjectNumber);
            modal.find('.modal-body #contract_number').val(selectedNode.ContractNumber);

            //luan here - find the project class name given the id
            modal.find('.modal-body #project_element_class').val('test123');

            //luan here - find the project type name given the id
            modal.find('.modal-body #project_type').val('test123');
        }


    };
    return obj;
}(jQuery));