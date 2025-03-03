import { ChevronRight, MousePointerClick, Paperclip, MoreVertical } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { MaterialsContext } from '../../context/MaterialsContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import MaterialFolderSkeleton from '../MaterialFolderSkeleton/MaterialFolderSkeleton';
import uploadingimg from '../../assets/images/uploading.gif'

export default function MaterialsItems() {
    const { selectedProjectFolder, selectedTeamFolder } = useContext(MaterialsContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [deletingAttachment, setDeletingAttachment] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    const [showDeleteAttachmentConfirmation, setShowDeleteAttachmentConfirmation] = useState(false);

    // Fetch attachments data
    const { data: attachmentsData, isLoading, isError, isRefetching } = useQuery({
        queryKey: ['attachments', { folderId: selectedTeamFolder?.id }], // Correct query key format
        queryFn: () =>
            axios.get(`https://brainmate.fly.dev/api/v1/materials/${selectedTeamFolder.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        enabled: !!selectedTeamFolder?.id, // Only fetch if folderId is available
    });

    // Handle file upload
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 8 * 1024 * 1024; // 8MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            toast.error('File size exceeds 8MB limit', {
                duration: 1000,
                position: 'bottom-right',
            });
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('attachments[]', file));

        try {
            setUploading(true);
            await axios.post(`https://brainmate.fly.dev/api/v1/materials/${selectedTeamFolder.id}`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Attachments uploaded successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            queryClient.invalidateQueries(['attachments', { folderId: selectedTeamFolder?.id }]); // Invalidate and refetch
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error uploading attachments', {
                duration: 1000,
                position: 'bottom-right',
            });
        } finally {
            setUploading(false);
        }
    };

    // Handle file deletion
    const handleFileDelete = async (attachmentId) => {
        setDeletingAttachment(true);
        try {
            await axios.delete(`https://brainmate.fly.dev/api/v1/materials/${attachmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Attachment deleted successfully', {
                duration: 1000,
                position: 'bottom-right',
            });
            queryClient.invalidateQueries(['attachments', { folderId: selectedTeamFolder?.id }]); // Invalidate and refetch
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting attachment', {
                duration: 1000,
                position: 'bottom-right',
            });
        } finally {
            setDeletingAttachment(false);
        }
    };

    // Confirmation and deletion logic
    const confirmDeleteAttachment = (attachmentId) => {
        setAttachmentToDelete(attachmentId);
        setShowDeleteAttachmentConfirmation(true);
    };

    const cancelDeleteAttachment = () => {
        setAttachmentToDelete(null);
        setShowDeleteAttachmentConfirmation(false);
    };

    const proceedDeleteAttachment = async () => {
        if (attachmentToDelete) {
            await handleFileDelete(attachmentToDelete);
            cancelDeleteAttachment();
        }
    };

    if (!selectedTeamFolder) {
        return (
            <div className="h-[calc(100vh-48px)] flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                    <MousePointerClick size={35} className='text-light' />
                    <h2 className='capitalize'>Please select team folder first</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="p-5">
            {/* Path Navigation */}
            <div className='text-gray-400 flex justify-between items-center lg:h-10 mb-5 px-5'>
                <div className='flex flex-wrap items-center'>
                    <div onClick={() => navigate('/materials')} className="pe-1 cursor-pointer">Materials</div>
                    <ChevronRight strokeWidth={0.7} />
                    <div onClick={() => navigate('/materials/project')} className="pe-1 cursor-pointer">{selectedProjectFolder?.name}</div>
                    <ChevronRight strokeWidth={0.7} />
                    <div onClick={() => navigate('/materials/project')} className="pe-1 cursor-pointer text-black dark:text-white">{selectedTeamFolder?.name}</div>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="">
                <div className="flex flex-wrap md:flex-row flex-col justify-between items-center mb-2">
                    <h2 className='capitalize mb-3 font-semibold text-gray-700 dark:text-gray-100'>Attachments</h2>
                    <div className="flex gap-2 items-center">
                        {uploading && <div className="hidden md:flex items-center text-blue-500"><img src={uploadingimg} alt="" className='w-6' /></div>}
                        <div className={`flex items-center p-2 py-1 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 ${uploading && 'opacity-50 cursor-wait'}`}>
                            <label htmlFor="file-upload" className={`${uploading ? 'cursor-wait' : 'cursor-pointer'} flex items-center gap-2`}>
                                <div className="w-6 h-6">
                                    <Paperclip size={22} className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Add Attachment</p>
                            </label>
                            <input id="file-upload" type="file" multiple onChange={handleFileUpload} className="hidden" disabled={uploading} />
                        </div>
                    </div>
                </div>
                <div className="flex lg:flex-row flex-col flex-wrap gap-3">
                    {isLoading ? <>
                        <MaterialFolderSkeleton />
                        <MaterialFolderSkeleton />
                        <MaterialFolderSkeleton />
                        <MaterialFolderSkeleton />
                    </> : <>
                        {attachmentsData?.data?.data?.attachments?.length > 0 ? (
                            attachmentsData.data.data.attachments.map((attachment, index) => (
                                <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer dark:border-gray-700 relative" onClick={() => window.open('https://brainmate.fly.dev/' + attachment.media, '_blank')}>
                                    {['.jpg', '.png', '.svg', '.jpeg'].some(ext => attachment.name.toLowerCase().endsWith(ext)) ? (
                                        <img src={`https://brainmate.fly.dev/${attachment.media}`} alt={attachment.name} className="w-16 h-16 object-cover rounded-lg" />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-dark2">
                                            <Paperclip size={24} className="text-gray-500 dark:text-gray-400" />
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">{attachment.name}</p>
                                    <div className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" onClick={(e) => { e.stopPropagation(); confirmDeleteAttachment(attachment.id); }}>
                                        <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                </div>
                            ))
                        ) : <>
                            <p className="text-gray-500 dark:text-gray-400 w-full text-center">No attachments found.</p>
                        </>
                        }
                    </>}
                </div>
            </div>

            {/* Delete Attachment Confirmation Popup */}
            <AnimatePresence>
                {showDeleteAttachmentConfirmation && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this attachment?</h2>
                            <div className="flex justify-end gap-3">
                                <button onClick={cancelDeleteAttachment} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                                <button onClick={proceedDeleteAttachment} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:cursor-wait" disabled={deletingAttachment}>Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}