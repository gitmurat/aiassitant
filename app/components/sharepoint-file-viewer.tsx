import React, { useState, useEffect } from "react";
import styles from "./file-viewer.module.css";
import { baseUrl } from "../assistant-config";
const TrashIcon = () => (
	<svg
		className={styles.fileDeleteIcon}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 12 12"
		height="12"
		width="12"
		fill="#353740"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.15736 1.33332C4.8911 1.33332 4.65864 1.51361 4.59238 1.77149L4.4214 2.43693H7.58373L7.41275 1.77149C7.34649 1.51361 7.11402 1.33332 6.84777 1.33332H5.15736ZM8.78829 2.43693L8.54271 1.48115C8.34393 0.707516 7.64653 0.166656 6.84777 0.166656H5.15736C4.35859 0.166656 3.6612 0.707515 3.46241 1.48115L3.21683 2.43693H1.33333C1.01117 2.43693 0.75 2.6981 0.75 3.02026C0.75 3.34243 1.01117 3.6036 1.33333 3.6036H1.39207L2.10068 10.2683C2.19529 11.1582 2.94599 11.8333 3.84087 11.8333H8.15913C9.05401 11.8333 9.80471 11.1582 9.89932 10.2683L10.6079 3.6036H10.6667C10.9888 3.6036 11.25 3.34243 11.25 3.02026C11.25 2.6981 10.9888 2.43693 10.6667 2.43693H8.78829ZM9.43469 3.6036H2.56531L3.2608 10.145C3.29234 10.4416 3.54257 10.6667 3.84087 10.6667H8.15913C8.45743 10.6667 8.70766 10.4416 8.7392 10.145L9.43469 3.6036ZM4.83333 4.83332C5.1555 4.83332 5.41667 5.09449 5.41667 5.41666V8.33332C5.41667 8.65549 5.1555 8.91666 4.83333 8.91666C4.51117 8.91666 4.25 8.65549 4.25 8.33332V5.41666C4.25 5.09449 4.51117 4.83332 4.83333 4.83332ZM7.16667 4.83332C7.48883 4.83332 7.75 5.09449 7.75 5.41666V8.33332C7.75 8.65549 7.48883 8.91666 7.16667 8.91666C6.8445 8.91666 6.58333 8.65549 6.58333 8.33332V5.41666C6.58333 5.09449 6.8445 4.83332 7.16667 4.83332Z"
		/>
	</svg>
);

const SharepointFileViewer = () => {
	const [files, setFiles] = useState([]);
	const [expandedFolders, setExpandedFolders] = useState({}); // Tracks expanded folder contents
	const [selectedFiles, setSelectedFiles] = useState({}); // Tracks selected files for upload



	useEffect(() => {
		const loadRootFiles = async () => {
			const rootFiles = await fetchFiles();
			setFiles(rootFiles);
		};
		loadRootFiles();
	}, []);

	const fetchFiles = async (folderId = "root") => {
		try {
			const resp = await fetch(`${baseUrl}/api/sharepoint-folder?folderId=${folderId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await resp.json();
			return data;
		} catch (error) {
			console.error("Error fetching files:", error);
			return [];
		}
	};

	const handleFolderToggle = async (folder) => {
		if (expandedFolders[folder.id]) {
			// Collapse folder
			setExpandedFolders((prev) => {
				const updated = { ...prev };
				delete updated[folder.id];
				return updated;
			});
		} else {
			// Expand folder and fetch contents
			const contents = await fetchFiles(folder.id);
			setExpandedFolders((prev) => ({
				...prev,
				[folder.id]: contents,
			}));
		}
	};
	useEffect(() => {
		console.log("selectedFiles", selectedFiles);
	}
		, [selectedFiles]);
	const handleCheckboxChange = async (file) => {
		const isSelected = selectedFiles[file.id];

		if (isSelected) {
			// If the file is already selected, unselect it
			setSelectedFiles((prev) => {
				const updated = { ...prev };
				delete updated[file.id];
				return updated;
			});
		} else {
			// If the file is not selected, select it and upload it
			setSelectedFiles((prev) => ({
				...prev,
				[file.id]: file,
			}));

			// Upload the file to OpenAI
			try {
				await uploadFileToOpenAI(file);
			} catch (error) {
				console.error(`Error uploading file ${file.name}:`, error);

				// Remove the file from `selectedFiles` if upload fails
				setSelectedFiles((prev) => {
					const updated = { ...prev };
					delete updated[file.id];
					return updated;
				});
			}
		}
	};
	const uploadFileToOpenAI = async (file) => {
		try {
			console.log("file to upload", file);

			const response = await fetch(`${baseUrl}/api/sharepoint-file-content?fileId=${file.id}`); // Fetch file content
			const fileContent = await response.blob();

			const formData = new FormData();
			formData.append("file", fileContent, file.name);

			const openAIResponse = await fetch(baseUrl + "/api/upload-from-sharepoint", {
				method: "POST",
				body: formData,
			});

			if (!openAIResponse.ok) {
				console.error(`Failed to upload file: ${file.name}`);
			} else {
				console.log(`Successfully uploaded: ${file.name}`);
			}
		} catch (error) {
			console.error(`Error uploading file ${file.name}:`, error);
		}
	};


	const handleFileUpload = async (event) => {
		const data = new FormData();
		if (event.target.files.length < 0) return;
		console.log(event.target.files);
		// Append all files to FormData
		for (const file of event.target.files) {
			data.append("files", file); // Key "files" will hold multiple files
		}
		// append existing file ids to the request
		const fileIds = files.map((file) => file.file_id);
		data.append("fileIds", JSON.stringify(fileIds));
		await fetch(baseUrl + "/api/assistants/files", {
			method: "POST",
			body: data,
		});
	};
	const renderItems = (items) => {
		return items.map((item) => (
			<div key={item.id} style={{ marginLeft: item.type === "folder" ? 20 : 40 }}>
				{item.type === "folder" ? (
					<div>
						<span
							onClick={() => handleFolderToggle(item)}
							style={{ cursor: "pointer", fontWeight: "bold" }}
						>
							📁 {item.name}
						</span>
						{expandedFolders[item.id] && (
							<div>{renderItems(expandedFolders[item.id])}</div>
						)}
					</div>
				) : (
					<div>
						<label>
							<input
								type="checkbox"
								checked={!!selectedFiles[item.id]}
								onChange={() => handleCheckboxChange(item)}
							/>
							📄 {item.name}
						</label>
					</div>
				)}
			</div>
		));
	};

	return (
		<div className={styles.fileViewer} >
			<div className={`${styles.filesList} ${files.length !== 0 ? styles.grow : ""
				}`} style={{ alignItems: 'flex-start !important' }}>

				{renderItems(files)}
			</div>
		</div>
		// <div className={styles.fileViewer}>
		// 	<div
		// 		className={`${styles.filesList} ${files.length !== 0 ? styles.grow : ""
		// 			}`}
		// 	>
		// 		{files.length === 0 ? (
		// 			<div className={styles.title}>Attach files here</div>
		// 		) : (
		// 			files.map((file) => (
		// 				<div key={file.file_id} className={styles.fileEntry}>
		// 					<div className={styles.fileName}>
		// 						<span className={styles.fileName}>{file.filename}</span>

		// 						<span className={styles.fileStatus}>
		// 							{file.file_id}
		// 						</span>
		// 					</div>
		// 					<span onClick={() => handleFileDelete(file.file_id)}>
		// 						<TrashIcon />
		// 					</span>
		// 				</div>
		// 			))
		// 		)}
		// 	</div>
		// 	<div className={styles.fileUploadContainer}>
		// 		<label htmlFor="file-upload" className={styles.fileUploadBtn}>
		// 			Attach files
		// 		</label>
		// 		<input
		// 			type="file"
		// 			id="file-upload"
		// 			name="file-upload"
		// 			className={styles.fileUploadInput}
		// 			multiple
		// 			onChange={handleFileUpload}
		// 		/>
		// 	</div>
		// </div>
	);
};

export default SharepointFileViewer;
