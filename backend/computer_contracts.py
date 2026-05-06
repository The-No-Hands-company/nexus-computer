from typing import TypedDict, Literal


HealthState = Literal["healthy", "degraded", "offline"]
ModeState = Literal["orchestrated", "standalone"]


class ComputerRegistrationPayload(TypedDict):
    id: str
    name: str
    description: str
    upstreamUrl: str
    mode: ModeState
    exposed: bool
    health: HealthState
    capabilities: list[str]


def build_systems_api_registration_payload(
    upstream_url: str,
    tool_id: str = "nexus-computer",
    tool_name: str = "Nexus Computer",
) -> ComputerRegistrationPayload:
    return {
        "id": tool_id,
        "name": tool_name,
        "description": "Personal AI cloud computer and edge runtime",
        "upstreamUrl": upstream_url,
        "mode": "standalone",
        "exposed": True,
        "health": "healthy",
        "capabilities": [
            "edge-runtime",
            "agent-execution",
            "workspace-tools",
            "automation",
            "hosted-services",
            "cloud-discovery",
        ],
    }
