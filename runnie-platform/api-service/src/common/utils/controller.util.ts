class ControllerUtil {
    static WrapJsonResponse(
        req: Request,
        entities: any,
        name: string,
        id?: string
    ): { data: any, meta: any } {
        if (!id && entities && entities.id) { id = entities.id; }

        const meta = {
            id: id,
            call: req.method + " " + req.url,
            count: 1,
            action: null
        };

        if (entities && Array.isArray(entities)) {
            Object.assign(meta, {
                page: 0,
                limit: entities.length,
                count: entities.length,
                action: "Got " + entities.length + " " + name + "s"
            });
        } else {
            meta.action = this.getMetaAction(req, name, id);
        }

        return {
            data:
                req.method == "GET" || req.method == "PUT" || req.method == "POST"
                    ? entities
                    : undefined,
            meta: meta
        }
    }

    static getMetaAction(req: Request, name: string, id: string) {
        switch (req.method) {
            case "GET":
                return "Retrieved " + name + " " + (id ?? "");
            case "PUT":
                return "Updated " + name + " " + id;
            case "POST":
                return "Added a " + name;
            case "DELETE":
                return"Deleted " + name + " " + id;
        }
    }
}