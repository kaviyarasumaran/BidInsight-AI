import {
  IconUserCheck,
  IconAlertTriangle,
  IconClipboardList,
  IconBuildingBank,
} from "@tabler/icons-react";

const SidebarPanelConfig = {
  title: "Agent Flow Architect",
  sections: [
    {
      title: "PROCESSES",
      items: [
        // {
        //   id: 'onboarding-hub',
        //   title: 'Onboarding Hub',
        //   icon: IconUserCheck,
        //   url: '/agents/onboarding-hub'
        // },
        // {
        //   id: 'irregularities',
        //   title: 'Irregularities',
        //   icon: IconAlertTriangle,
        //   url: '/agents/irregularities'
        // },
        {
          id: "Insurance",
          title: "Insurance",
          icon: IconClipboardList,
          hasChildren: true,
          children: [
            {
              id: "policy",
              title: "Policy",
              url: "/agents/insurance/policy-underwriting",
              hasChildren: true,
              children: [
                {
                  id: "Life",
                  title: "Life",
                  url: "/dashboards/agents?flow=life",
                  flowType: "life",
                },
                {
                  id: "underwriting",
                  title: "Underwriting",
                  url: "/agents/insurance/policy-underwriting",
                },
                {
                  id: "Customer Onboarding",
                  title: "Customer Onboarding",
                  url: "#",
                },
              ],
            },
            {
              id: "Claims",
              title: "Claims",
              url: "/agents/claims",
              hasChildren: true,
              children: [
                {
                  id: "Motor",
                  title: "Motor",
                  url: "/agents/insurance/motor",
                  flowType: "motor",
                },
                // {
                //   id: 'work-program',
                //   title: 'Work Program',
                //   url: '/agents/internal-audit/it-gov/work-program'
                // }
              ],
            },
          ],
        },
        {
          id: "Banking",
          title: "Banking",
          icon: IconBuildingBank,
          hasChildren: true,
          children: [
            {
              id: "Internal Audit - IFRS",
              title: "Internal Audit - IFRS",
              url: "/dashboards/agents?flow=ifrs",
              flowType: "ifrs",
              hasChildren: false,
            },
            // {
            //   id: "Loan Processing",
            //   title: "Loan Processing",
            //   url: "/dashboards/agents?flow=loan-processing",
            //   flowType: "loan-processing",
            // },
            {
              id: "Fraud",
              title: "Fraud",
              url: "/dashboards/agents?flow=fraud",
              flowType: "fraud",
            },
          ],
        },
      ],
    },
  ],
};

export default SidebarPanelConfig;
