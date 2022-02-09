import fs from "fs";
import path from "path";

function getFiles(dir, files) {
	const dirContents = fs.readdirSync(dir);

	files = files || [];

	return dirContents.flatMap((f) => {
		const filePath = path.join(dir, f).replace(/\\/g, "/");
		return fs.statSync(filePath).isDirectory() ? getFiles(filePath, files) : filePath;
	});
}

export function getPosts() {
	return getFiles("posts").filter((f) => /.+\.md$/i.test(f));
}
