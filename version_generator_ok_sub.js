var md5Lib = require('md5');
var fs     = require('fs');
var path   = require('path');
var crypto = require('crypto');
const zl = require("zip-lib");
const md5File = require('md5-file')

// node version_generator.js -v 1.17.2.30 -u http://168.63.253.67/rvip-update/rvip-remote-asset/ -s rvip-remote-asset/ -d assets/

var dest = './rvip-remote-asset/build';
//var src  = './build/jsb-default/build';
var src  = './rvip-remote-asset/build/';
 
var manifest = {
	 
	version: '1.0.0',
	assets: {},
	searchPaths: []
};
// Parse arguments
var i = 2;
var folder = "2.4";
while ( i < process.argv.length) {
	var arg = process.argv[i];

	switch (arg) {
	case '--url' :
	case '-u' :
		var url = process.argv[i+1];
		manifest.packageUrl = url;
		manifest.remoteManifestUrl = url + 'project.manifest';
		manifest.remoteVersionUrl = url + 'version.manifest';
		i += 2;
		break;
	case '--version' :
	case '-v' :
		manifest.version = process.argv[i+1];
		i += 2;
		break;
	case '--src' :
	case '-s' :
		src = process.argv[i+1];
		i += 2;
		break;
	case '--dest' :
	case '-d' :
		dest = process.argv[i+1];
		i += 2;
		break;
	case '--folder' :
	case '-f' :
		folder = process.argv[i+1];
		i += 2;
		break;	
	default :
		i++;
		break;
	}
}
manifest.packageUrl= 'https://tai.exness.exchange/'+folder+'/';
manifest.remoteManifestUrl= 'https://tai.exness.exchange/'+folder+'/project.manifest';
manifest.remoteVersionUrl= 'https://tai.exness.exchange/'+folder+'/version.manifest';

function CheckMd5(dir, obj){
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			CheckMd5(subpath, obj);
		}
		else if (stat.isFile()) {
			// Size in Bytes
			size = stat['size'];
			md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
			
			obj.push(md5)
		}
	}
}
function readDir (dir, obj) {
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			readDir(subpath, obj);
		}
		else if (stat.isFile()) {
			// Size in Bytes
			size = stat['size'];
			md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
			compressed = path.extname(subpath).toLowerCase() === '.zip';

			relative = path.relative(src, subpath);
			relative = relative.replace(/\\/g, '/');
			relative = encodeURI(relative);
			obj[relative] = {
				'size' : size,
				'md5' : md5
			};
			if (compressed) {
				obj[relative].compressed = true;
			}
		}
	}
}
var mkdirSync = function (path) {
	try {
		fs.mkdirSync(path);
	} catch(e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
}
function getFiles (dir, files_,status){
    files_ = files_ || [];
    status = status || true;
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
			//if(status)
				//getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}
// Iterate res and src folder
function getFolders (dir, folder_){
    folder_ = folder_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            folder_.push(name);
        }
    }
    return folder_;
}

function getDirectory (dir, files_){
    files_ = files_ || [];
	
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            files_.push(name);
        }
    }
    return files_;
}
function copyFileSync(source, target) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    var a = source.split(path.sep);
    a.shift();
    a.shift();
    var f = a.join("/");
	fs.copyFileSync( source, targetFile);
    //fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target,level) {
    var files = [];
    //check if folder needs to be created or integrated
	if(level > 0){
		var targetFolder = path.join(target, path.basename(source));
		if (!fs.existsSync(targetFolder)) {
			fs.mkdirSync(targetFolder);
		}
	}else{
		targetFolder = target;
	}
	level++;
    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder,level);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}
function readDirZip (dir, obj,name,status) {
	var stat = fs.statSync(dir);
	if (!stat.isDirectory()) {
		return;
	}
	var subpaths, subpath, size, md5, compressed, relative;
	if(status){
		subpaths = [name];
	}else{
		subpaths = fs.readdirSync(dir);
	}
	var zip = null;
	var lists = {};
 
	for (var i = 0; i < subpaths.length; ++i) {
		if (subpaths[i][0] === '.') {
			continue;
		}
		subpath = path.join(dir, subpaths[i]);
		 
		stat = fs.statSync(subpath);
		if (stat.isDirectory()) {
			
			//var zip = new zl.Zip();
			//zip.addFolder(subpath, subpaths[i]);
			let key = subpaths[i];
			
			if(!lists.hasOwnProperty(key)){
				lists[key] = {
					import:{},
					native:{},
					files:[]
				};
			}
			let _stepCount = stepCount;
			if(key == "main"){
				_stepCount = stepCount*2;
			}
			 
			let import_files = getFolders(subpath+"/import");
			 
			for(let iii = 0; iii < import_files.length ; iii++){
				 let val = import_files[iii];
				 let sub = val.substring(val.length-2,val.length);
				 
				 let _key = sub[0].toString().charCodeAt() % parseInt(_stepCount/2);
				 
				 if(!lists[key].import.hasOwnProperty(_key)){
					 lists[key].import[_key] = [];
				 }
				 lists[key].import[_key].push([val,sub])
			}
			let native_files = getFolders(subpath+"/native");
			for(let iii = 0; iii < native_files.length ; iii++){
				 let val = native_files[iii];
				 let sub = val.substring(val.length-2,val.length);
				 
				 let _key = sub[0].toString().charCodeAt()%_stepCount;
				 
				 if(!lists[key].native.hasOwnProperty(_key)){
					 lists[key].native[_key] = [];
				 }
				 lists[key].native[_key].push([val,sub])
			}
			lists[key].files = getFiles(subpath,[],false);
			 
		}
	}
	
	 
	for(let i in lists){
		
			
			let ppp = "";
			
			ppp = pzip+"/assets";
			if (!fs.existsSync(ppp)) {
				 mkdirSync(ppp);
			}
			ppp = ppp+"/"+i;
			if (!fs.existsSync(ppp)) {
				 mkdirSync(ppp);
			}
			if(status){
				
			}else{
				ppp = ppp+"/assets";
				if (!fs.existsSync(ppp)) {
					 mkdirSync(ppp);
				}
				ppp+="/"+i;
				if (!fs.existsSync(ppp)) {
					 mkdirSync(ppp);
				}
			}
	 
			for(let ii in lists[i]){
				if(ii == 'files'){
					 
					  var zip = new zl.Zip();
					  let fileKey;
					  if(status){
						  fileKey = "assets/"+i+"/"+i+'.zip';
					  }else{
						  fileKey = name+"/"+i+"/assets/"+i+"/"+i+".zip";
					  }
					  let _md5 = [];
					  for(let iii in lists[i][ii]){
						  console.log(lists[i][ii][iii]);
						let statsObj = md5File.sync(lists[i][ii][iii]);//fs.statSync(lists[i][ii][iii]);
						 
						_md5.push(statsObj);
					
						//_md5.push(crypto.createHash('md5').update(fs.readFileSync(lists[i][ii][iii], 'binary')).digest('hex'));
					  }
					  let strMd5  = md5Lib(JSON.stringify(_md5));
					  let keyMd4 = md5Lib(fileKey);
					if(strMd5 != dataLOG[keyMd4]){
						obj.count.push([fileKey,strMd5,dataLOG[keyMd4]])
						dataLOG[keyMd4] = strMd5;
						
						for(let iii in lists[i][ii]){
							zip.addFile(lists[i][ii][iii]);
						}
						count++;
						zip.archive(path.join(pzip,fileKey)).then(function () {
							count--;	
						}, function (err) {
							console.log(err);
						});	
					}else{
						dataLOG[keyMd4] = strMd5;
					}
				}else{
					 
					if (!fs.existsSync(ppp+"/"+ii)) {
						 mkdirSync(ppp+"/"+ii);
					}
					for(let iii in lists[i][ii]){
						var zip = new zl.Zip();
						let fileKey = "";
						 if(status){
							fileKey = "assets/"+i+"/"+ii+"/"+iii+'.zip';
						 }else{
							fileKey = name+"/"+i+"/"+name+"/"+i+"/"+ii+"/"+iii+'.zip'; 
						 }
			 
						 let _md5 = [];
						for(let iiii in lists[i][ii][iii]){
							let ob = [];
							CheckMd5(lists[i][ii][iii][iiii][0],ob);
							_md5.push(ob);
						}
						let strMd5  = md5Lib(JSON.stringify(_md5));
						let keyMd4 = md5Lib(fileKey);
						
						if(strMd5 != dataLOG[keyMd4]){
							obj.count.push([fileKey,strMd5,dataLOG[keyMd4]])
							console.log(fileKey+" Change:"+strMd5+" "+dataLOG[keyMd4]);	
							dataLOG[keyMd4] = strMd5;
							dataNewMd5[fileKey] = 1;
							for(let iiii in lists[i][ii][iii]){
								let val = lists[i][ii][iii][iiii];
								zip.addFolder(val[0],val[1]);
							}
							count++;
							 
							if(fs.existsSync(path.join(pzip,fileKey))){
								fs.unlinkSync(path.join(pzip,fileKey));
							}
						    
							zip.archive(path.join(pzip,fileKey)).then(function () {
								count--;	
								//let md5 = crypto.createHash('md5').update(fs.readFileSync(dest+"/"+name+"/"+i+'.zip', 'binary')).digest('hex');
								//console.log(dest+"/"+name+"/"+i+'.zip'+"="+md5);
							}, function (err) {
								console.log(err);
							});	
						}else{
						  //console.log(fileKey+" NO:"+strMd5);	
						  dataLOG[keyMd4] = strMd5;
						}
					}
			  }
			}
	}
}
let directory = getDirectory(path.join(src, 'assets'));

var stepCount = 15;
console.log(directory);
let sub = path.join(dest, 'sub');
mkdirSync(dest)
let passets = path.join(sub, "assets");
if (!fs.existsSync(passets)) {
	fs.mkdirSync(passets);
}
let pzip = path.join(sub, folder);
if (!fs.existsSync(pzip)) {
	fs.mkdirSync(pzip);
}
let pzassets = path.join(pzip, "assets");
if (!fs.existsSync(pzassets)) {
	fs.mkdirSync(pzassets);
}
let folders = {
	
};


let count = 0;
let dataLOG = {};
let createUpdate = false;
try{
	createUpdate = fs.existsSync(pzip+"/log.json");
	dataLOG = JSON.parse(fs.readFileSync(pzip+"/log.json"));
}catch(e){
	dataLOG = {};
}
let VersionLOG = {};

try{
    if(fs.existsSync(pzip+"/version.json")){
		VersionLOG = JSON.parse(fs.readFileSync(pzip+"/version.json"));
	}
}catch(e){
	VersionLOG = {};
}

let dataNewMd5 = {};
let changes = {};
for(let i in directory){
	let name = path.basename(directory[i]);
	let folder = name;
	
	if(name =="main" || name == "resources" || name == "internal"){
		folder = "looby";
		
		if(!folders.hasOwnProperty(folder)){
			folders[folder] = [];
		}
		let p = path.join(passets, name);
		if (!fs.existsSync(p)) {
			fs.mkdirSync(p);
		}
		folders[folder].push(name);
	}else{
		if(!folders.hasOwnProperty(folder)){
			folders[folder] = [];
		}
		folders[folder].push(name);
		
		let p = path.join(passets, folder);
		if (!fs.existsSync(p)) {
			fs.mkdirSync(p);
		}
		let pp = path.join(p, "assets");
		if (!fs.existsSync(pp)) {
			fs.mkdirSync(pp);
		}
	}
	
}
let array = [];

for(let i in folders){
	var myPromise = new Promise((resolve, reject) => {
		let url;
	
		if( i == "looby"){
			url = manifest.packageUrl;
		}else{
			url = manifest.packageUrl+"assets/"+i+"/";
		}
		let _manifest = {
			packageUrl: url,
			remoteManifestUrl: url+'project.manifest',
			remoteVersionUrl: url+'version.manifest',
			version: '1.0.0',
			assets: {},
			searchPaths: []
		};
		var destManifest;
		var destVersion;
		if( i == "looby"){
			 
			copyFolderRecursiveSync(path.join(src, 'src'),sub,1);
			copyFolderRecursiveSync(path.join(src, 'jsb-adapter'),sub,1);
			readDir(path.join(src,"src"), _manifest.assets);
			readDir(path.join(src,"jsb-adapter"), _manifest.assets);
			
			for(let ii in folders[i]){
				copyFolderRecursiveSync(path.join(src, 'assets/'+folders[i][ii]),passets+"/"+folders[i][ii],0);
				readDir(path.join(src,"/assets/"+folders[i][ii]), _manifest.assets);
			}
			 destManifest = path.join(sub, '/project.manifest');
			 destVersion  = path.join(sub, '/version.manifest');
		}else{
			for(let ii in folders[i]){
				copyFolderRecursiveSync(path.join(src, 'assets/'+folders[i][ii]),path.join(passets, i+"/assets/"),1);
				readDir(path.join(src,"/assets/"+folders[i][ii]), _manifest.assets);
			}
			 destManifest = path.join(passets, i+'/project.manifest');
			 destVersion  = path.join(passets, i+'/version.manifest');
		}
		fs.writeFile(destManifest, JSON.stringify(_manifest), (err) => {
			if (err) throw err;
			console.log('Manifest successfully generated');
		});
		delete _manifest.assets;
		delete _manifest.searchPaths;
		fs.writeFile(destVersion, JSON.stringify(_manifest), (err) => {
			if (err) throw err;
			console.log('Version successfully generated');
		});
		setTimeout(() => {
			resolve(i);
		}, 1000);
	});
	array.push(myPromise);
}

Promise.all(array).then((values) => {
   console.log(values);
   
	if (!fs.existsSync(path.join(pzip, 'assets'))) {
     mkdirSync(path.join(pzip, 'assets'));
	}
	if (!fs.existsSync(path.join(pzip, 'src'))) {
		 mkdirSync(path.join(pzip, 'src'));
	}
	if (!fs.existsSync(path.join(pzip, 'jsb-adapter'))) {
		 mkdirSync(path.join(pzip, 'jsb-adapter'));
	}
	changes = {};
	for(let i in folders){
		let zipObject = {count:[]};
		for(let ii in folders[i]){
			let _path = passets+"/"+folders[i][ii];
			if(fs.existsSync(_path+"/assets")){
			 	readDirZip(_path+"/assets",zipObject,"assets",false);
			}else{
				readDirZip(passets,zipObject,folders[i][ii],true);
			}
		}
		console.log(zipObject);
		changes[i] = zipObject;
	}
	copyFolderRecursiveSync(path.join(sub, 'src'),path.join(pzip, 'src'),0);
	copyFolderRecursiveSync(path.join(sub, 'jsb-adapter'),path.join(pzip, 'jsb-adapter'),0);
	
    let t = setInterval(function(){
		console.log(count);
		if(count == 0){
			clearInterval(t);
			for(let i in folders){
				let url;
			
				var destManifest;
				var destVersion;
				if( i == "looby"){
					url = manifest.packageUrl;
					destManifest = path.join(pzip, '/project.manifest');
					destVersion  = path.join(pzip, '/version.manifest');
				}else{
					url = manifest.packageUrl+"assets/"+i+"/";
					destManifest = path.join(pzassets, i+'/project.manifest');
					destVersion  = path.join(pzassets, i+'/version.manifest');
				}
				let _manifest = {
					packageUrl: url,
					remoteManifestUrl: url+'project.manifest',
					remoteVersionUrl: url+'version.manifest',
					version: manifest.version ,
					assets: {},
					searchPaths: []
				};
				let assetsNew = {};
				for(let ii in folders[i]){
					let _path = pzip+"/assets/"+folders[i][ii];
					 
					let _assetsNew = {};
					readDir(_path,_assetsNew);
					assetsNew[ii] = _assetsNew;
				}
				
				if( i == "looby"){
					let _path = pzip+"/jsb-adapter";
			 
					let _assetsNew = {};
					readDir(_path,_assetsNew);
					assetsNew['jsb_adapter'] = _assetsNew;
					let _path1 = pzip+"/src";
				 
					let _assetsNew1 = {};
					readDir(_path1,_assetsNew1);
					assetsNew['src'] = _assetsNew1;
				}
				
				for(let ii in assetsNew){
					for(let iii in assetsNew[ii]){
						let k = iii.split("/");
						 
						if( i == "looby"){
							_manifest.assets[k.slice(2).join('/')] = assetsNew[ii][iii];
							
						}else{
							_manifest.assets[k.slice(4).join('/')] = assetsNew[ii][iii];
						}
					}
				}
				
				delete _manifest.assets['project.manifest'];
				delete _manifest.assets['version.manifest'];
				
			    let keyContent = md5Lib(JSON.stringify(_manifest.assets));
				let verOld = "0.0.0";
				let verNew = _manifest.version;
				
				if(VersionLOG.hasOwnProperty(i)){
					verOld = VersionLOG[i].version;
					if(changes[i] && changes[i].count  == 0){
						_manifest.version = verOld;
					}
				}
				VersionLOG[i] = {md5:keyContent,version:_manifest.version};
				fs.writeFile(destManifest, JSON.stringify(_manifest), (err) => {
					if (err) throw err;
					console.log("Old:"+verOld+"= New:"+verNew+' Manifest ('+i+') successfully generated '+_manifest.version);
				});
				delete _manifest.assets;
				delete _manifest.searchPaths;
				fs.writeFile(destVersion, JSON.stringify(_manifest), (err) => {
					if (err) throw err;
					console.log("Old:"+verOld+"= New:"+verNew+ ' Version ('+i+') successfully generated '+_manifest.version);
				});
			}
			fs.writeFile(pzip+"/log.json", JSON.stringify(dataLOG), (err) => {
				if (err) throw err;
				console.log('Version successfully dataLOG generated');
			});
			fs.writeFile(pzip+"/version.json", JSON.stringify(VersionLOG), (err) => {
				if (err) throw err;
				console.log('Version successfully VersionLOG generated');
			});
		}
	},100);
});