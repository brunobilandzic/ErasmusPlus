import { RoleRequest } from "@/model/db_models/roles";
import dbConnect from "@/model/mongooseConnect";

export const makeRoleRequest = async (userId, role) => {
    try {
        await dbConnect();
        console.log("Database connected");

        // Create a new role request
        const newRoleRequest = new RoleRequest({
            userId,
            role,
        });

        // Save the role request to the database
        await newRoleRequest.save();

        console.log(`Role request created: ${newRoleRequest}`);

    } catch (error) {
        console.error("Error making role request: ", error);
        throw new Error("Error making role request");
    }
  }

export const getRoleRequests = async () => {
    try {
        await dbConnect();
        console.log("Database connected");

        // Find all role requests
        const roleRequests = await RoleRequest.find();

        console.log(`Role requests found: ${roleRequests}`);

        return roleRequests;

    } catch (error) {
        console.error("Error getting role requests: ", error);
        throw new Error("Error getting role requests");
    }
}

export const respondToRoleRequest = async (roleRequestId, status) => {
    try {
        await dbConnect();
        console.log("Database connected");

        // Find the role request by ID
        const roleRequest = await RoleRequest.findById(roleRequestId);

        // Check if the role request exists
        if (!roleRequest) {
            console.log("Role request not found");
            throw new Error("Role request not found");
        }

        // Update the status of the role request
        roleRequest.status = status;

        // Save the updated role request to the database
        await roleRequest.save();

        console.log(`Role request updated: ${roleRequest}`);

    } catch (error) {
        console.error("Error responding to role request: ", error);
        throw new Error("Error responding to role request");
    }
}