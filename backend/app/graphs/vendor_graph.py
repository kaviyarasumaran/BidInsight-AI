from __future__ import annotations

from langgraph.graph import END, StateGraph

from app.nodes.confidence_node import confidence_node
from app.nodes.evidence_node import evidence_extraction_node
from app.nodes.human_review_node import human_review_check_node
from app.nodes.ocr_node import ocr_node
from app.nodes.parser_node import parser_node
from app.nodes.types import VendorState


def build_vendor_graph():
    g = StateGraph(VendorState)
    g.add_node("ocr", ocr_node)
    g.add_node("parser", parser_node)
    g.add_node("evidence_extract", evidence_extraction_node)
    g.add_node("confidence", confidence_node)
    g.add_node("review_check", human_review_check_node)

    g.set_entry_point("ocr")
    g.add_edge("ocr", "parser")
    g.add_edge("parser", "evidence_extract")
    g.add_edge("evidence_extract", "confidence")
    g.add_edge("confidence", "review_check")
    g.add_edge("review_check", END)
    return g.compile()
