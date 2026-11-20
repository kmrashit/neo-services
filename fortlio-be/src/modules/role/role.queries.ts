import { PipelineStage } from 'mongoose';

export const getRolesWithPrivilegesPipeline: PipelineStage[] = [
  { $lookup: { from: 'privileges', localField: 'rolePrivileges', foreignField: 'code', as: 'rolePrivileges' } },
  { $addFields: { roleId: '$_id' } },
  { $addFields: { rolePrivileges: { $map: { input: '$rolePrivileges', as: 'p', in: { $mergeObjects: ['$$p', { privilegeId: '$$p._id' }] } } } } },
];

export const getPrivilegesPipeline: PipelineStage[] = [
  { $addFields: { privilegeId: '$_id' } },
];
