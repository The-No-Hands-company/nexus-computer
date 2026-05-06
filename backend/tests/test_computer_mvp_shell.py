import unittest

from computer_contracts import build_systems_api_registration_payload


class TestNexusComputerMVPShell(unittest.TestCase):
    def test_registration_payload_shape_is_stable(self):
        payload = build_systems_api_registration_payload(
            upstream_url="http://localhost:8001",
            tool_id="nexus-computer",
            tool_name="Nexus Computer",
        )

        self.assertEqual(payload["id"], "nexus-computer")
        self.assertEqual(payload["name"], "Nexus Computer")
        self.assertEqual(payload["mode"], "standalone")
        self.assertTrue(payload["exposed"])
        self.assertEqual(payload["health"], "healthy")
        self.assertEqual(payload["upstreamUrl"], "http://localhost:8001")
        self.assertIn("agent-execution", payload["capabilities"])
        self.assertIn("workspace-tools", payload["capabilities"])
        self.assertIn("cloud-discovery", payload["capabilities"])

    def test_registration_payload_allows_custom_tool_identity(self):
        payload = build_systems_api_registration_payload(
            upstream_url="https://computer.example",
            tool_id="nexus-computer-node-a",
            tool_name="Nexus Computer Node A",
        )

        self.assertEqual(payload["id"], "nexus-computer-node-a")
        self.assertEqual(payload["name"], "Nexus Computer Node A")
        self.assertEqual(payload["upstreamUrl"], "https://computer.example")


if __name__ == "__main__":
    unittest.main()
