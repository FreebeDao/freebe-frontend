// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
struct baseDao {
    string daoDomain;
    string  daoName;
    string  daoLogo;//路径
    string  daoMission;
    uint8  daoColor;
    address  daoCreater;
}
struct task {
    uint id;
    string name;
    string objective;
    string results;
    uint value;
    uint deadline;
    uint8 status;
    address builder;
}

contract Dao {
    using Counters for Counters.Counter;
    Counters.Counter public taskIds;
    baseDao public baseInfo;
    address public owner;
    task[] public taskList;
    

    modifier onlyOwner() {
        require(msg.sender==owner, "Ownable: caller is not the owner");
        _;
    }
    constructor(string memory _daoDomain,string memory _daoName,string memory _daoLogo,string memory _daoMission,uint8 _daoColor,address _daoCreater) {
        baseInfo=baseDao(_daoDomain,_daoName,_daoLogo,_daoMission,_daoColor,_daoCreater);
        owner=msg.sender;
    }

    function edit(string memory _daoName,string memory _daoLogo,string memory _daoMission,uint8 _daoColor) external onlyOwner{
        baseInfo.daoName=_daoName;
        baseInfo.daoLogo=_daoLogo;
        baseInfo.daoMission=_daoMission;
        baseInfo.daoColor=_daoColor;
    }
    function getInfo() view external returns (string memory _daoName,string memory _daoLogo,string memory _daoMission,uint8 _daoColor,address _daoCreater){
        _daoName= baseInfo.daoName;
        _daoLogo=baseInfo.daoLogo;
        _daoMission=baseInfo.daoMission;
        _daoColor=baseInfo.daoColor;
        _daoCreater=baseInfo.daoCreater;
    }

    function createTask(string memory _name,string memory _objective,string memory _results,uint _value,uint _deadline) external {
        taskIds.increment();
        task memory newtask=task(taskIds.current(),_name,_objective,_results,_value,_deadline,0,address(0));
        taskList.push(newtask);
    }
    function claimTask(uint _id,address user)external onlyOwner{
        task memory theTask=taskList[_id];
        require(theTask.builder==address(0),"the task is claimed");
        require(theTask.status==0,"the task is claimed");
        theTask.builder=user;
        taskList[_id]=theTask;
    }
    function getTaskList()external view returns(task[] memory _taskList){
        _taskList=taskList;
    }

}
contract Freebe {
    // Add the library methods
    using EnumerableSet for EnumerableSet.AddressSet;

    // Declare a set state variable
    EnumerableSet.AddressSet private daoSet;

    uint public unlockTime;
    address payable public owner;
    mapping(string => address) isExistDomain;
    event Withdrawal(uint amount, uint when);

    function createDao(string memory _daoDomain,string memory _daoName,string memory _daoLogo,string memory _daoMission,uint8 _daoColor) public {
        Dao newdao=new Dao(_daoDomain,_daoName,_daoLogo,_daoMission,_daoColor,msg.sender);
        daoSet.add(address(newdao));
        isExistDomain[_daoDomain]=address(newdao);
    }
    function getDaoList()public view returns(baseDao[] memory){
        address[] memory _daolist=daoSet.values();
        baseDao[] memory _daoinfolist=new baseDao[](_daolist.length);
        for (uint i = 0; i < _daolist.length; i++) {
            baseDao memory thedao;
            (thedao.daoName,thedao.daoLogo,thedao.daoMission,thedao.daoColor,thedao.daoCreater)=Dao(_daolist[i]).getInfo();
            _daoinfolist[i]=thedao;
        }
        return _daoinfolist;
    }
    function createTask(Dao thedao,string memory _name,string memory _objective,string memory _results,uint _value,uint _deadline) public {
        thedao.createTask(_name,_objective,_results,_value,_deadline);
    }
    function getTaskList(Dao thedao)public view returns(task[] memory _taskList){
        _taskList=thedao.getTaskList();
    }
    function claimTask(Dao thedao,uint _id)public{
        thedao.claimTask(_id,msg.sender);
    }
    function searchDomian(string memory _domain) external view returns(bool){
        return isExistDomain[_domain]!=address(0);
    }

}
